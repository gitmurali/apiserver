var http = require('http');
var result = require('./result.json');
var fs = require('fs');
var ejs = require('ejs');
var request = require('ajax-request');

var port = 8181;

var getServerURL = function() {
    return "http://localhost:" + port;
}

var server = http.createServer(function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');

        if(req.url === '/'){
            request(getServerURL() + '/api/getbalance', function(err, data, body) {
                var accountData = JSON.parse(body);
                if(accountData){
                    var filePath = __dirname + '/views/accountinfo.ejs';
                    var template = fs.readFileSync(filePath, 'utf8');
                    var html = ejs.render(template,{accountInfo: accountData});
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(html);
                    res.end();
                }else{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write("No data received..");
                    res.end();
                }
            });

            // res.writeHead(200, {'Content-Type': 'text/html'});
            // fs.createReadStream('index.html').pipe(res);

        }else if (req.url === '/api/getbalance') {

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            var random = Math.random();
            if (random >= 0.8) {
                res.writeHead(503);
                res.end();
            } else {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.write(JSON.stringify(result, 0, 4));
                res.end();
            }
        }
        else {
            res.writeHead(404);
            res.end();
        }
    })
;

server.listen(port, function () {
    console.log("Server listening on: http://localhost:%s", port);
});
