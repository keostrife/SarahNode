var http = require('http');
var fs = require('fs');
global.porn = require(__dirname+'/../porn.js');

var sarah = require("./sarah");

let serve = (req, res) => {
	var hi = sarah.response('Hi');
	res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(req.url);
  res.end();
}

http.createServer(function (req, res) {
	//if file exists, load file
	//load index.html by default
	fs.stat(filePath=__dirname+req.url, (err, stats)=>{
		if(!err) {
			filePath += stats.isDirectory()?"/index.html":"";
			fs.readFile(filePath, (err, data) => {
		    res.writeHead(200, {'Content-Type': 'text/html'});
		    res.write(data);
		    res.end();
		  });
		  return;
		}

		//if file doesn't exist, serve the request
		serve(req, res);
	});
}).listen(1305);

