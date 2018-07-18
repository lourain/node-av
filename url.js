var http = require('http')
var cheerio = require('cheerio')
var fs = require('fs')
var path = require('path')


function get_html(url) {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            var html;
            res.on('data', chunk => {
                html += chunk
            })
            res.on('end', () => {
                resolve(html);
            })
        })

    })
}

async function insert_json(pageNum) {
    var i = 1;
    let json = [];
    while (i <= pageNum) {
        const url = `http://www.992jj.com/index.php?mode=async&function=get_block&block_id=list_videos_most_recent_videos&sort_by=post_date&from=${i}`
        let _html = await get_html(url)
        let $ = cheerio.load(_html)
        $('.margin-fix .item').each(function (item) {
            var o = {}
            var av_name = $('a', this).attr('title')
            var av_url = $('a', this).attr('href')
            o['av_name'] = av_name
            o['av_url'] = av_url
            json.push(o)
        })
        i++
    }
    return json
}


module.exports = insert_json

