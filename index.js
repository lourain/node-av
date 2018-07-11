var https = require('https')
var mysql = require('mysql')
var fs = require('fs')
var path = require('path')

const db = mysql.createPool({
    host: '122.152.219.175',
    user: 'root',
    password: 'root',
    database: 'blog'
})

const resourcePath = path.join(__dirname, './resource')
var start_num = parseInt(process.argv[2])//从第几部开始下
var amount = parseInt(process.argv[3] || 30)//下载多少部电影，默认30部
fs.exists(resourcePath, exists => {
    !exists && fs.mkdirSync(resourcePath)
})
if (start_num) {
    var i=start_num;
    while (i < (start_num + amount)) {
        var path_num = start_num < 1000 ? 0 : 1000;
        var movie_url = `https://a3c3b3.com//${path_num}/${i}/${i}.mp4`
        download(movie_url, i)
        i++
        
    }
} else {
    db.query(`SELECT * FROM av_table`, (err, data) => {
        if (err) console.error(err);
        var _data = data
        _data.forEach((item, index) => {
            let av_url = item.av_url
            let av_name = item.av_name.replace(/\s*/g,'')
            var movie_num = av_url.match(/\/\d{1,5}/g)[0].slice(1)
            var path_num = movie_num < 1000 ? 0 : 1000;
            var movie_url = `https://a3c3b3.com//${path_num}/${movie_num}/${movie_num}.mp4`
            download(movie_url, av_name)
        })
    });

}



function download(movie_url, index, callback) {
    https.get(movie_url, res => {
        const writeStream = fs.createWriteStream(path.join(__dirname, 'resource', `${index}.mp4`))
        res.setEncoding('binary')
        res.on('data', chunk => {
            writeStream.write(chunk, 'binary')
        })
        res.on('end', () => {
            console.log(`${index}.mp4 下载成功！`);
            callback && callback()
        })
    })
}
