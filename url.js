var http = require('http')
var cheerio = require('cheerio')

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
        })
    })
})