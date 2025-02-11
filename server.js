var https = require("https");
var http = require("http");
var url = require("url");
var path = require('path');
var fs = require("fs");
var querystring = require('querystring');

var isHTTPS = true;
var port = isHTTPS ? '443' : '9080';
var sslfile = {
    cert: "./ssl/ip.cer",
    key: "./ssl/ip.key"
};
// 默认主页
var default_html = "login.html"

var mime = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

var reqlis = function (req, res) {
    var pathname = url.parse(querystring.unescape(req.url)).pathname;
    if (pathname == '/') pathname = "/" + default_html;
    var filepath = __dirname + pathname;
    fs.access(filepath, fs.constants.F_OK, function (err) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html;charset=utf8' });
            res.end('<div styel="color:black;font-size:22px;">404 not found</div>');
            return;
        }
        fs.stat(filepath, function (err, stats) {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html;charset=utf8' });
                res.end('<div styel="color:black;font-size:22px;">server error</div>');
            } else {
                if (stats.isFile()) {

                    var ext = path.extname(filepath);
                    ext = ext ? ext.slice(1) : 'unknown';
                    var contentType = mime[ext] || "text/plain";

                    var file = fs.createReadStream(filepath);
                    res.writeHead(200, { 'Content-Type': contentType });
                    file.pipe(res);
                } else {
                    fs.readdir(filepath, function (err, files) {
                        var str = '';
                        for (var i in files) {
                            str += '<a href="' + files[i] + '">' + files[i] + '</a><br/>';
                        }
                        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8' });
                        res.end(str);
                    });
                }
            }
        });
    });
};

var server = isHTTPS ? https.createServer({
    key: fs.readFileSync(sslfile.key),
    cert: fs.readFileSync(sslfile.cert)
}, reqlis) : http.createServer(reqlis);

if (isHTTPS) {
    console.log(`Server running at https://127.0.0.1`);
}else{
    console.log(`Server running at http://127.0.0.1:${port}`);
}

server.listen(port, '::');