var _search = require("../suite.js")("search"), commands = {}, commandResponses = {}, commandActions = {};

_search.setFancyName("Super Search");




var command1 = "search";
var command1Alias = ["google", "look up", "find out", "about", "find out about", "look for", "search for", "help me with", "google this"];
var command1ResAlias = ["here is what you are looking for", "here you go", "Boooom!!!", "Is this what you are looking for?", "Is this it?"];
var command1Action = function(responseAlias){
	var http = require('http');
	http.get("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q="+encodeURIComponent(this.commandContent)+"&key=AIzaSyBsCt5mN-7mesb4Wn37yfkMZ-cpHhsMCRw", function(res) {
	  	res.setEncoding('utf8');
	  	var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function(){
			var googleContent = JSON.parse(data);
			console.log(googleContent.responseData.results[0].url);
			$("#actionPanel").html('<iframe width="100%" height="500" src="'+googleContent.responseData.results[0].url+'"></iframe>').find("iframe");
		});
	});
	$("#response").html(responseAlias[Math.floor(Math.random()*(responseAlias.length - 1))]);
}

commands[command1] = command1Alias;
commandResponses[command1] = command1ResAlias;
commandActions[command1] = command1Action;

for(var command in commands) {
	//register command
	_search.registerCommand(command);

	//register command alias
	for(var i = 0, iLen = commands[command].length; i<iLen; i++)
	_search.registerCommandAlias(command, commands[command][i]);

	//register command response alias
	for(var i = 0, iLen = commandResponses[command].length; i<iLen; i++)
	_search.registerResponseAlias(command, commandResponses[command][i]);

	//register command action
	_search.registerAction(command, commandActions[command]);
}




module.exports = _search;