var redis = require("redis"),
	db = redis.createClient();

db.on("error", function (err) {
    console.log("Error " + err);
});

function dbAsync() {
	IO.addListener("connection", this.init.bind(this));
}


dbAsync.prototype = {
	_bN_name: "dbAsync",
	_bN_clientCode: function(){
		IO.on("updateDB", function(data){
			if(data) {
				if(typeof(Storage)!=="undefined"){
					localStorage = data;
					console.log("local storage updated: " + localStorage);
				} else {
					alert("local storage is not supported, please update your browser!");
				}
			}
		});
		bN.updateServer = function(){
			IO.emit("updateDB", localStorage);
		}
	},
	_bN_init: function(){
		//this function will get run automatically after the class is instanciated
	},
	init: function(socket){
		var that = this;
		bN.on(socket, "updateDB", function(data){
			that.updateDB(socket, data);
		});
	},
	updateDB: function(socket, content){
		db.hset(socket.id, "_bN_dbasync",JSON.stringify(content), redis.print);
	},
	getDB: function(){
		db.hget(socket.id, "_bN_dbasync", function(err, replies){
			return JSON.parse(replies);
		});
	},
	updateClient: function(socket){
		socket.emit("updateDB", this.getDB());
	}
}

module.exports = dbAsync;