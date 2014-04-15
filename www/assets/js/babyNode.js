var __CONF__ = {
	speedThreshold: 5 //ms
}

var bN = (function($, config){
	var _localSocket = 'http://localhost',
		_BRKeoSocket = 'http://192.168.5.126',

	_currentSocket = _localSocket,

	_port = "8080",

	_io,

	_messages = {};

	return {
		io: io.connect(_currentSocket),
		init: function(){
			IO  = bN.io;
			IO.on("init", bN.import);
		},
		import: function(data){
			var imports = data.importLinks;
			for(var i = 0, iLen = imports.length; i<iLen;i++) {
				var link = imports[i].path;
				var script = document.createElement('script');
				script.src = link;
				document.head.appendChild(script);
				if(i == iLen - 1){
					script.onload = function(){
						bN.emit("clientReady");
					}
				}
			}
			__CONF__.speedThreshold = data.speedLimit;
			
		},
		emit: function(message, data){
			_messages[message] = _messages[message] || {};

			if(_messages[message].timeout) {
				clearTimeout(_messages[message].timeout);
				_messages[message].timeout = setTimeout(function(){
					IO.emit(message, data);
				}, config.speedThreshold);
			} else {
				_messages[message].timeout = setTimeout(function(){
					IO.emit(message, data);
				}, config.speedThreshold);
			}
		},
		on: function(message, handler) {
			socket.on(message, function(data){
				handler(data);
			});
		}
	}
}(jQuery, __CONF__));


