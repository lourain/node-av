var https = require('https')
var fs = require('fs')
var path = require('path')
var _json = require('./url')


class Reptile {
    constructor() {
        this.resourcePath = path.join(__dirname, './resource')
        this.start_num = parseInt(process.argv[2] || 1)//从第几部开始下
        this.amount = parseInt(process.argv[3])//下载多少部电影
    }

    async get_json() {
        return await _json()
    }
    //模式1，选择第几部 往后下载多少部
    async  model_1() {
        var i = this.start_num;
        var arr = []
        while (i < (this.start_num + this.amount)) {
            var path_num = this.start_num < 1000 ? 0 : 1000;
            var movie_url = `https://a3c3b3.com//${path_num}/${i}/${i}.mp4`
            // this.download(movie_url, i)
            arr.push(this.download(movie_url, i))
            i++
        }
        Promise.all(arr, value => {
            console.log(value)
            process.exit('全部下载成功！')
        })
    }
    //模式2，下载最新的前几页的所有视频
    async model_2() {
        let _data = await this.get_json()
        console.log(_data.length);
        var arr = []
        _data.forEach(item => {
            let av_url = item.av_url
            // let av_name = item.av_name.replace(/\s*/g,'')
            let av_name = item.av_name
            var movie_num = av_url.match(/\/\d{1,5}/g)[0].slice(1)
            var path_num = movie_num < 1000 ? 0 : 1000;
            var movie_url = `https://a3c3b3.com//${path_num}/${movie_num}/${movie_num}.mp4`
            arr.push(this.download(movie_url, av_name))
            // this.download(movie_url, av_name)
        })
        Promise.all(arr, value => {
            console.log(value)
            process.exit('全部下载成功！')
        })
    }
    async  models() {
        fs.exists(this.resourcePath, exists => {
            if (exists) {
                this.start_num && this.amount ? this.model_1() : this.model_2()
            } else {
                fs.mkdir(this.resourcePath, err => {
                    this.models()
                })
            }
        })
    }
    download(movie_url, index) {
        return new Promise((resolve, reject) => {
            https.get(movie_url, res => {
                const writeStream = fs.createWriteStream(path.join(__dirname, 'resource', `${index}.mp4`))
                res.setEncoding('binary')
                res.on('data', chunk => {
                    writeStream.write(chunk, 'binary')
                })
                res.on('end', () => {
                    console.log(`${index}.mp4 下载成功！`);
                    resolve(`${index}.mp4 下载成功！`)
                }).on('error', err => {
                    reject(err)
                })
            })

        })
    }
}

new Reptile().models()
