var https = require('https')
var fs = require('fs')
var path = require('path')
var _json = require('./url')

const resourcePath = path.join(__dirname, './resource')
var start_num = parseInt(process.argv[2] || 1)//从第几部开始下 或是 下载最新的前几页
var amount = parseInt(process.argv[3])//下载多少部电影

fs.exists(resourcePath, exists => {
    !exists && fs.mkdirSync(resourcePath)
})

class Reptile {
    constructor() {
        this.resourcePath = path.join(__dirname, './resource')
        this.start_num = parseInt(process.argv[2] || 1)//从第几部开始下 或是 下载最新的前几页
        this.amount = parseInt(process.argv[3])//下载多少部电影
    }

    async get_json() {
        return await _json(this.start_num)
    }
    //模式1，选择第几部 往后下载多少部
    async  model_1() {
        var i = start_num;
        while (i < (start_num + amount)) {
            var path_num = start_num < 1000 ? 0 : 1000;
            var movie_url = `https://a3c3b3.com//${path_num}/${i}/${i}.mp4`
            this.download(movie_url, i)
            i++
        }
    }
    //模式2，下载最新的前几页的所有视频
    async model_2() {
        let _data = await this.get_json()
        console.log(_data);
        
        _data.forEach(item => {
            let av_url = item.av_url
            let av_name = item.av_name
            var movie_num = av_url.match(/\/\d{1,5}/g)[0].slice(1)
            var path_num = movie_num < 1000 ? 0 : 1000;
            var movie_url = `https://a3c3b3.com//${path_num}/${movie_num}/${movie_num}.mp4`
            this.download(movie_url,av_name)
        })
    }
    async  models() {
        fs.exists(resourcePath, exists => {
            if (exists) {
                start_num && amount ? this.model_1() : this.model_2()
            }
        })
    }
    download(movie_url, index, callback) {
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
}

new Reptile().models()


//模式1，选择第几部 往后下载多少部
// async function model_1() {
//     var i = start_num;
//     while (i < (start_num + amount)) {
//         var path_num = start_num < 1000 ? 0 : 1000;
//         var movie_url = `https://a3c3b3.com//${path_num}/${i}/${i}.mp4`
//         download(movie_url, i)
//         i++
//     }
// }

// //模式2，下载最新的前几页的所有视频
// async function model_2() {
//     let _data = await get_json()
//     console.log(_data.length)
//     _data.forEach(item => {
//         let av_url = item.av_url
//         let av_name = item.av_name
//         var movie_num = av_url.match(/\/\d{1,5}/g)[0].slice(1)
//         var path_num = movie_num < 1000 ? 0 : 1000;
//         var movie_url = `https://a3c3b3.com//${path_num}/${movie_num}/${movie_num}.mp4`
//     })
// }

// async function models() {
//     fs.exists(resourcePath, exists => {
//         if (exists) {
//             start_num && amount ? model_1() : model_2()
//         }
//     })
// }

// models()


// function download(movie_url, index, callback) {
//     https.get(movie_url, res => {
//         const writeStream = fs.createWriteStream(path.join(__dirname, 'resource', `${index}.mp4`))
//         res.setEncoding('binary')
//         res.on('data', chunk => {
//             writeStream.write(chunk, 'binary')
//         })
//         res.on('end', () => {
//             console.log(`${index}.mp4 下载成功！`);
//             callback && callback()
//         })
//     })
// }
