module.exports = Suite;

function Suite(suiteName){
	if(!(this instanceof Suite)) return new Suite(suiteName);
	this.name = suiteName;
	this.fancyName = "";
	this.commandList = [];
	this.aliasList = []; //command alias list
	this.responseList = [];
	this.commands = {};
	this.commandAlias = {};
	this.actions = {};
	this.responseAlias = {};
	this.container = null;
	this.commandContent = ""; //cache instance property if u use it
}

Suite.prototype = {

	/*
		initialize suite with settings
	*/
	init: function(settings){
		this.container = settings.container;
	},


	/*
		Register a command
		*throw error if command already exist

		@command (String) -> command to register
		[@alsoCreateAlias] (Boolean:TRUE) -> whether to also create an alias the same as the command
		[@cb (Function)] -> callback

		>> void
	*/
	registerCommand: function(command, alsoCreateAlias){
		if(!arguments.length || typeof command != "string") {
			throw 'invalid argument, expect command as string';
			return;
		} else if (this.haveCommand(command)) {
			throw 'command already exists';
			return;
		}

		this.commandList.push(command);
		if(typeof alsoCreateAlias != "boolean" || alsoCreateAlias == true){
			//default to true
			this.registerCommandAlias(command, command);
		}

		//callback
		if(typeof arguments[arguments.length-1] == "function")arguments[arguments.length-1].call(this);
	},

	/*
		Register a command alias, also register the command if it doesn't exist (doesn't automatically create alias of itself)
		*throw error if alias already exist unless force=TRUE

		@command (String) -> command to register alias into
		@alias (String) -> alias to register into command
		[@force (Boolean)] -> force alias to be registered no matter it exists or not
		[@cb (Function)] -> callback

		>> void
	*/
	registerCommandAlias: function(command, alias, force){
		if(force == "undefined") force = true;
		if(!arguments.length || typeof command != "string" || typeof alias != "string") {
			throw 'invalid argument, expect command and alias as string';
			return;
		} else if (!force && this.haveAlias(alias)) {
			throw 'alias already exists';
			return;
		}

		//register command if it doesn't exist
		if(!this.haveCommand(command)) this.registerCommand(command, false);

		this.commandAlias[alias] = command;
		if(!this.haveAlias(alias)) this.aliasList.push(alias);

		//callback
		if(typeof arguments[arguments.length-1] == "function")arguments[arguments.length-1].call(this);
	},

	/*
		Register an action for provided command, also register the command if it doesn't exist (doesn't automatically create alias of itself)
		action function will be provided with the first argument as responseList
		*throw error if action already registered unless force=TRUE

		@command (String) -> command to register action into
		@action (Function) -> action to register into command
		[@force (Boolean)] -> force action to be registered no matter it exists or not
		[@cb (Function)] -> callback

		>> void
	*/
	registerAction: function(command, action, force){
		if(force == "undefined") force = true;
		if(!arguments.length || typeof command != "string" || typeof action != "function") {
			throw 'invalid argument, expect command as string and action as function';
			return;
		} else if (!force && this.commands[command]) {
			throw 'There is already one action registered to command "'+command+'"';
			return;
		}

		if(force) this.deleteAction(command);

		//register command if it doesn't exist
		if(!this.haveCommand(command)) this.registerCommand(command, false);



		this.commands[command] = action;

		//callback
		if(typeof arguments[arguments.length-1] == "function" && arguments.length > 2)arguments[arguments.length-1].call(this);
	},

	/*
		Register a response alias into a command

		@command (String) -> command to register alias into
		@resAlias (Function) -> response alias to register into command
		[@cb (Function)] -> callback

		>> void
	*/
	registerResponseAlias: function(command, resAlias){
		if(!arguments.length || typeof command != "string" ||typeof resAlias != "string") {
			throw 'invalid argument, expect command and alias as string';
			return;
		}

		//register command if it doesn't exist
		if(!this.haveCommand(command)) this.registerCommand(command, false);


		if(!this.haveResponseAlias(resAlias)) {
			this.responseList.push(resAlias);
			this.responseAlias[command] = this.responseAlias[command] || [];
			this.responseAlias[command].push(resAlias);
		}

		//callback
		if(typeof arguments[arguments.length-1] == "function" && arguments.length > 2)arguments[arguments.length-1].call(this);
	},

	/*
		Run a command from an alias

		@alias (String) -> command alias to run command
		[@cb (Function)] -> callback

		>> void
	*/
	disgestCommand: function(alias, force){
		if(force == "undefined") force = true;
		if(!this.commandAlias[alias]) {
			if(!force) throw "command alias \""+alias+"\" not found.";
			return;
		} else if(!this.commands[this.commandAlias[alias]]) {
			if(!force) throw "no action found for the command: " + this.commandAlias[alias] + " ("+alias+").";
			return;
		}
		var command = this.commandAlias[alias];
		this.responseAlias[command] = this.responseAlias[command] || [];
		this.commands[command].call(this, this.responseAlias[command]);
		
		//callback
		if(typeof arguments[arguments.length-1] == "function" && arguments.length > 2)arguments[arguments.length-1].call(this);
	},

	/*
		Run a command directly

		@command (String) -> command to run
		[@cb (Function)] -> callback

		>> void
	*/
	runCommand: function(command, cb){
		if(!this.haveCommand(command)) {
			throw "command \""+command+"\" not found.";
			return;
		} else if(!this.commands[command]) {
			throw "no action found for the command: " + command;
			return;
		}

		this.responseAlias[command] = this.responseAlias[command] || [];
		this.commands[command].call(this, this.responseAlias[command]);
		if(typeof cb == "function") cb.call(this);
	},

	/*
		Find command from an alias

		@alias (String) -> alias to find command

		>> (String) The command
		>> FALSE if can't find any
	*/
	findCommandFromAlias: function(alias) {
		return this.commandAlias[alias] && this.commandAlias[alias];
	},

	/*
		Find alias from a command

		@command (String) -> command to find alias

		>> (Array) List of alias
		>> FALSE if can't find any
	*/
	findAliasFromCommand: function(command) {
		var returnList = [];
		for(var i = 0, iLen = this.aliasList.length; i<iLen; i++) {
			var alias = this.aliasList[i];
			if(this.commandAlias[alias] == command) returnList.push(alias);
		}
		return returnList.length && returnList;
	},

	/*
		Find response alias from a command

		@command (String) -> command to find alias

		>> (Array) List of alias
		>> FALSE if can't find any
	*/
	findResponseAliasFromCommand: function(command) {
		return this.responseAlias[command] && this.responseAlias[command];
	},

	/*
		Whether an alias exist

		@alias (String) -> alias to check

		>> (Boolean)
	*/
	haveAlias: function(alias) {
		return this.commandAlias[alias] && true;
	},

	/*
		Whether a command exist

		@command (String) -> command to check

		>> (Boolean)
	*/
	haveCommand: function(command) {
		for(var i = 0, iLen = this.commandList.length; i<iLen;i++) if(command == this.commandList[i]) return true;
		return false;
	},
	
	/*
		Whether a command has action registered to it

		@command (String) -> command to check

		>> (Boolean)
	*/
	commandHasAction: function(command) {
		if(!this.haveCommand(command) || !this.commands[command]) return false;
		return true;
	},

	/*
		Whether a response alias exist

		@alias (String) -> response alias to check

		>> (Boolean)
	*/
	haveResponseAlias: function(alias){
		for(var i = 0, iLen = this.responseList.length; i<iLen; i++) {
			if(alias == this.responseList[i]) return true;
		}
		return false;
	},
	
	/*
		Delete a command and all of its references

		@command (String) -> command to delete

		>> void
	*/
	deleteCommand: function(command) {
		//delete from list
		var index = this.commandList.indexOf(command);
		if(index !== -1) this.commandList.splice(index,1);
		else return;

		//delete all alias
		for(var i = 0; i<this.aliasList.length;i++) {
			var alias = this.aliasList[i];
			if(this.commandAlias[alias] == command) {
				//remove from list
				this.aliasList.splice(i,1);
				i--; //prevent case skipping

				//remove from object
				this.commandAlias[alias] = null;
				delete this.commandAlias[alias];
			}
		}

		//delete action
		this.commands[command] = null;
		delete this.commands[command];
	},

	/*
		Delete alias

		@alias (String) -> delete alias

		>> void
	*/
	deleteAlias: function(alias) {
		//delete from list
		var index = this.aliasList.indexOf(alias);
		if(index !== -1) this.aliasList.splice(index,1);
		else return;

		//delete alias
		this.commandAlias[alias] = null;
		delete this.commandAlias[alias];
	},

	/*
		Delete action from a command

		@command (String) -> delete action that was registered to the command

		>> void
	*/
	deleteAction: function(command) {
		if(!this.haveCommand(command)) return;

		this.commands[command] = null;
		delete this.commands[command];
	},

	/*
		Delete response alias

		@alias (String) -> response alias to delete

		>> void
	*/
	deleteResponseAlias: function(alias){
		var index = this.responseList.indexOf(alias);
		if(index !== -1) this.responseList.splice(index,1);
		else return;

		for (var key in this.responseAlias) {
			var aliasList = responseAlias[key];
			for(var i = 0, iLen = aliasList.length; i<iLen; i++) {
				if(aliasList[i] == alias) {
					aliasList.splice(i,1);
					return;
				}
			}
		}
	},

	/*
		Set command subject

		@content (String) -> set the command content

		>> void
	*/
	setCommandContent: function(content){
		this.commandContent = content || "";
	},

	/*
		set suite's fancy name
		
		@fancy name (String)

		>> void
	*/
	setFancyName: function(name){
		this.fancyName = name;
	}


}