//global variables
__ROOTPATH__ = __dirname;


//initiate
require("./modules/babynode/babyNode");
bN.init(8080).import(["jQuery","dbAsync"]);



IO.on("connection", function(socket){
	bN.on(socket, "clientReady", function(){

		//start coding!!!
		$("body", socket).css({backgroundColor:"green"}).click(function(){
			alert('heheh');
		});
		
	});
});





