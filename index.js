var https = require('https')
var http = require('http')
var cheerio = require('cheerio')
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
fs.exists(resourcePath, exists => {
    !exists && fs.mkdirSync(resourcePath)
})
db.query(`SELECT * FROM av_table`, (err, data) => {
    if (err) console.error(err);
    var _data = data
    _data.forEach((item,index) => {
        let av_url = item.av_url
        let av_name = item.av_name
        var movie_num = av_url.match(/\/\d{1,5}/g)[0].slice(1)
        var path_num = movie_num <= 1000 ? 0 : 1000;
        var movie_url = `https://a3c3b3.com//${path_num}/${movie_num}/${movie_num}.mp4`
        
        https.get(movie_url, res => {
            const writeStream = fs.createWriteStream(path.join(__dirname, 'resource', `${index}.mp4`))
            res.setEncoding('binary')
            res.on('data', chunk => {
                writeStream.write(chunk, 'binary')
            })
            res.on('end', () => {
                console.log(`${index}.mp4 下载成功！`);

            })
        })





    })
});
