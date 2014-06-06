//global variables
__ROOTPATH__ = __dirname;


//initiate
require("./modules/babynode/babyNode");
bN.init(8080).import(["jQuery","dbAsync"]);

//instanciate singleton suitManager
var suiteManager = require("./modules/suiteManager")();


IO.on("connection", function(socket){
	bN.on(socket, "clientReady", function(){
		//start coding
		$().setGlobalSocket(socket);
		suiteManager.importSuite("search");

		bN.on(socket, "command", function(data){
			suiteManager.disgestCommand(data.command, data.commandInput);
		});
	});
});





