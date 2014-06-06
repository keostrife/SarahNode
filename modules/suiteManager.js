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
	this.suiteName = [];

	this.importSuite = function(suite) {
		if(typeof suite == "object") {
			this.suites[suite.name] = suite;
			this.suiteList.push(suite.name);
			this.suiteName.push(suite.fancyName?suite.fancyName:suite.name);
		} else if (typeof suite == "string") {
			var self = this;
			fs.exists('./modules/suites/'+suite+'.js', function(exist){

				if(exist) {
					var instance = require('./suites/'+suite);
					self.suites[instance.name] = instance;
					self.suiteList.push(instance.name);
					self.suiteName.push(instance.fancyName?instance.fancyName:instance.name);
				}
			});
		} else {
			throw "invalid argument, expect an instance of Suite";
		}
	}

	this.getSuitesName = function(){
		return this.suiteName;
	}

	this.getSuiteByName = function(suiteName) {
		return this.suites[suiteName] && this.suites[suiteName];
	}

	this.disgestCommandWithSuite = function(suiteName, command, commandInput, force) {
		if(this.suites[suiteName])
			this.suites[suiteName].disgestCommand(command, force);
	}

	this.disgestCommand = function(command, commandInput){
		for(var i = 0, iLen = this.suiteList.length; i<iLen; i++) {
			if(commandInput) this.suites[this.suiteList[i]].setCommandContent(commandInput);
			this.suites[this.suiteList[i]].disgestCommand(command, true);
		}
	}

}