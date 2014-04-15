//global variables
__ROOTPATH__ = __dirname;


//initiate
require("./modules/babynode/babyNode");
bN.init(8080).import(["jQuery","dbAsync"]);

//instanciate singleton suitManager
var suitManager = require("./modules/suiteManager")();
suitManager.importSuite("search");

IO.on("connection", function(socket){
	bN.on(socket, "clientReady", function(){
		//start coding		
	});
});





