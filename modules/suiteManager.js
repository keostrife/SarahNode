module.exports = suiteManager;
var fs = require('fs');

function suiteManager(){
	//singleton
	if(arguments.callee.singletonInstance) return arguments.callee.singletonInstance;
	else arguments.callee.singletonInstance = this;
	//shorthand instanciation
	if(!this instanceof suiteManager) return new suiteManager();

	this.suites = {};
	this.suiteList = [];

	this.importSuite = function(suite) {
		if(typeof suite == "object" && suite.constructor && suite.constructor.name == "Suite") {
			this.suites[suite.name] = suite;
			this.suiteList.push(suite.name);
			return;
		} else if (typeof suite == "string") {
			fs.readFile('./suites/'+suite, 'utf8', function(err, data){
				if(!err && typeof data == "function") {
					var instance = new data();
					this.suites[instance.name] = instance;
					this.suiteList.push(instance.name);
					return;
				}
			});
		}
		throw "invalid argument, expect an instance of Suite";
	}

	this.getSuiteByName = function(suiteName) {
		return this.suites[suiteName] && this.suites[suiteName];
	}

	this.disgestCommandWithSuite = function(command, suiteName, force) {
		if(this.suites[suiteName])
			this.suites[suiteName].disgestCommand(commnand, force);
	}

	this.disgestCommand = function(command){
		for(var i = 0, iLen = suiteList.length; i<iLen; i++) 
			this.suites[suiteList[i]].disgestCommand(command, true);
	}

}