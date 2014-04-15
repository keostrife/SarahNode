(function(){
	//a list of plugins got imported
	var _plugins = {}, _io, _config;
	var route = require('./route');
	//jQuery like initiator, simply instanciate the plugin that got imported
	function _bN(selector) {
		if(selector && _plugins[selector]) {
			return new _plugins[selector]();
		} else {
			return _bN.fn; 
		}
	}

	_bN.fn = _bN.prototype = {
		init: function(port){
			var server = require('http').createServer(route.reqHandler);
			IO = _io = require('socket.io').listen(server);
			__CONF__ = require('./config');
			if(!port)server.listen(80);
			else server.listen(port);
			
			
			_io.addListener("connection", this.clientImport);

			return this;
		},
		on: function(socket, message, handler){
			var messages = {},
				gTimestamp,
				gCallStack = 0,
				gStackThreshold = __CONF__.trafficStackThreshold, //10 call stacks
				gSpeedThreshold = __CONF__.trafficSpeedThreshold; //5ms
				//It means server will receive maximum of 10 DIFFERENT messages which get sent faster than 5ms 
				//and no more than 1 of the same message can get sent faster than speed threshold


			messages[message] = messages[message] || {};


			socket.on(message, function(data){
				var currentTime = new Date().getTime();
				if(messages[message].timestamp && currentTime - messages[message].timestamp < gSpeedThreshold) {
					console.log("requests received too fast");
					socket.disconnect();
				} else {
					if(gTimestamp && currentTime - gTimestamp < gSpeedThreshold){
						if(gCallStack > gStackThreshold){
							console.log("more than "+gStackThreshold+" different requests received too fast");
							socket.disconnect();
						} else {
							messages[message].timestamp = gTimestamp = currentTime;
							gCallStack++;
							handler(data);
						}
					} else {
						messages[message].timestamp = gTimestamp = currentTime;
						gCallStack = 0;
						handler(data);
					}
					
				}
			});
		},
		emit: function(socket, message){
			socket.emit(socket, message);
		},
		import: function(pluginNames, options){
			
			if(typeof pluginNames == "string"){
				var pluginName = pluginNames;
				var importClass = require("./plugins/"+pluginName);
				var plugin = new importClass(options);
				_plugins[plugin._bN_name] = importClass;
				route.addExceptions({
					path: __CONF__.jsPath + plugin._bN_name + ".js",
					content: plugin._bN_clientCode
				});
				plugin._bN_init();
			} else {
				for(var i = 0,iLen = pluginNames.length;i<iLen;i++) {
					var pluginName = pluginNames[i];
					var importClass = require("./plugins/"+pluginName);
					var plugin = new importClass(options);
					_plugins[plugin._bN_name] = importClass;
					route.addExceptions({
						path: __CONF__.jsPath + plugin._bN_name + ".js",
						content: plugin._bN_clientCode
					});
					plugin._bN_init();
				}
			}
			
			return this;
		},
		clientImport: function(socket) {
			socket.emit("init", {
				importLinks: route.getExceptions(),
				speedLimit: __CONF__.gSpeedThreshold
			});
		}
	}


	babyNode = _bN;
	bN = babyNode();
}());