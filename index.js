var https = require('https')
var cheerio = require('cheerio')
var fs = require('fs')
var path = require('path')
const url = 'https://a3c3b3.com//1000/1921/1921.mp4'
const resoucePath = path.join(__dirname,'./resouce')
//获取url
http.get('http://www.992jj.com/',(res)=>{
    var html = ''
    res.on('data',(chunk)=>{
        html += chunk
    })
    res.on('end',()=>{
        var $ = cheerio(html)
    })
})

//判读路径是否存在 只有当不存在时 才创建
fs.exists(resoucePath,(exists)=>{
    !exists && fs.mkdirSync(path.join(__dirname,'./resouce'))
})


https.get(url,(res)=>{
    const writeStream = fs.createWriteStream(path.join(__dirname,'./resouce','av.mp4'))
    res.setEncoding = 'binary'
    res.on('data',(chunk)=>{
        writeStream.write(chunk,(err)=>{
            if(err) console.error(err);
        })
    })
    res.on('end',()=>{
        console.log('success!');
        
    })
})