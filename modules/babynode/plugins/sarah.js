function _Sarah() {

}

_Sarah.prototype = {
	_bN_name: "sarah",
	_bN_clientCode: function(){
		
	},
	_bN_init: function(){
		//this function will get run automatically after the class is instanciated
	},
	setGlobalSocket: function(socket){
		_gSocket = socket;
	},
	getGlobalSocket: function(){
		return _gSocket;
	}
}

module.exports = _Sarah;