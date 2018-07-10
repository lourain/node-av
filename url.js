var http = require('http')
var cheerio = require('cheerio')
var mysql = require('mysql')
const db = mysql.createPool({
    host: '122.152.219.175',
    user:'root',
    password:'root',
    database:'blog'
})
const url = 'http://www.992jj.com'

http.get(url,res=>{
    var html;
    res.on('data',chunk=>{
        html += chunk
    })
    res.on('end',()=>{
        var $ = cheerio.load(html)
        console.log($('#list_videos_videos_watched_right_now_items .item').length)
        $('#list_videos_videos_watched_right_now_items .item').each(function(item){
            var av_name = $('.title',this).text()
            var av_url = $('a',this).attr('href')
            db.query(`INSERT INTO av_table (av_name,av_url) VALUES ('${av_name}','${av_url}')`, err => {
                if(err){
                    console.error(err);                
                }else{
                    console.log('insert success!');
                    
                }
            })
        })
    })
})