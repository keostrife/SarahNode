module.exports = suiteManager;
var fs = require('fs');

function suiteManager(){
	if(!(this instanceof suiteManager)) return new suiteManager();

	//singleton
	if(arguments.callee.singletonInstance) return arguments.callee.singletonInstance;
	else arguments.callee.singletonInstance = this;
	//shorthand instanciation
	

	this.suites = {};
	this.suiteList = [];

	this.importSuite = function(suite) {
		if(typeof suite == "object") {
			this.suites[suite.name] = suite;
			this.suiteList.push(suite.name);
		} else if (typeof suite == "string") {
			var self = this;
			fs.exists('./modules/suites/'+suite+'.js', function(exist){

				if(exist) {
					var instance = require('./suites/'+suite);
					self.suites[instance.name] = instance;
					self.suiteList.push(instance.name);
				}
			});
		} else {
			throw "invalid argument, expect an instance of Suite";
		}
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