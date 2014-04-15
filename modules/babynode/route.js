var fs = require('fs'),
	url = require("url");

var exceptions = [];

var _queryString = null;

function _load404(res) {
	fs.readFile(__ROOTPATH__ + '/www/404.html', function(err, data) {
	  	if (err) {
	    		res.writeHead(500);
	    		res.end('Internal Error! Whoever made this site doesn\'t provide a 404 page... shame on them!!!');
	    		return;
	  	}

	  	res.writeHead(404);
	  	res.end(data);
	});
}

function Route(){

}
Route.prototype = {
	addExceptions: function(o) {
		exceptions.push({
			path: o.path,
			content: o.content
		});
	},
	reqHandler: function(req, res) {
		var uri = url.parse(req.url, true).pathname;
		
		//get query string
		var queryString = url.parse(req.url, true).search.substr(1).split('&');
		if (queryString != "") {
			_queryString = {};
			for (var i = 0; i < queryString.length; ++i)
			{
			    var p=queryString[i].split('=');
			    if (p.length != 2) continue;
			    _queryString[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
			}
		} else {
			_queryString = {};
		}

		//routing exceptions
		for(var i = 0, iLen = exceptions.length; i<iLen; i++) {
			var exeption = exceptions[i];
			if(uri == exeption.path) {
				res.writeHead(200);
				var finalContent = String(exeption.content).split('{');
				finalContent.shift();
				finalContent = finalContent.join("{").trim().slice(0, -1);
				res.write(finalContent);
				res.end();
				return;
			}
		}

		//read index.html by default
		var uri = uri.split("/");
		uri.shift();
		if(!uri[uri.length - 1]){
			uri.pop();
		}
		if(uri.length < 1) {
		  	fs.readFile(__ROOTPATH__ + '/www/index.html', function(err, data) {
		    	if (err) {
		      		_load404(res);
		      		return;
		    	}

		    	res.writeHead(200);
		    	res.end(data);
		  	});
		} else {
			uri = uri.join("/");
			if(uri.indexOf(".") < 0){
				fs.readFile(__ROOTPATH__ + '/www/'+uri + '/index.html', function(err, data) {
			    	if (err) {
			      		_load404(res);
			      		return;
			    	}

			    	res.writeHead(200);
			    	res.end(data);
			  	});
			} else {
				fs.readFile(__ROOTPATH__ + '/www/'+uri, function(err, data) {
			    	if (err) {
			      		_load404(res);
			      		return;
			    	}

			    	res.writeHead(200);
			    	res.end(data);
			  	});
			}
			
		}
	},
	getExceptions: function(){
		return exceptions;
	},
	getQueryString: function(){
		return _queyString;
	}
}

module.exports = new Route();
