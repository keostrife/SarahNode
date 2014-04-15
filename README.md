babyNode
========

nodejs socketIO plugin system

Basically the idea is to have a plugin system for nodeJS using socketIO

Normally you will have to write code on both client and server for an application to work (socket.emit and socket.on)

This system uses a dirty trick to dynamically generate code from the server and make client import it as legit javascript code.

Therefor, with one import statement from server, both client and server have what they need to be up and running...

I wrote a very sketchy jquery plugin that allows u to write jquery code from server...

That would be a sample if you want to contribute a plugin :)

I'm glad to hear from anyone who's interested


======Core concept explained======

Steps -> steps:

1. First CLIENT and SERVER have to establish a successful connection,

2. SERVER will than generate javascript code for browser and routed it into an URL (Ex: localhost:8080/this/is/a/very/secured/path/jquery.js)

3. SERVER notify CLIENT to import the javascript code and provide the routed URL

4. CLIENT will create a new &lt;script> tag with src = routed URL, and than append that script tag to <head>

5. CLIENT run the newly imported javascript code automatically.

6. CLIENT notify SERVER that the new code is fully loaded and ready for further trafic

7. SERVER receive "clientReady" message, here goes more code




======Performance?======

sacrifice a header request for a big gain of code quality and organization? Worth it!!!
Well... I would go for it!





======How to write a plugin?======

A sample of a plugin provided (jQuery)

You must provide a class (I know there's no class in JS, but it will be too confusing calling it prototype or anything else... so let's call it "class" for now. You get the idea!!)

basically you need to prepare a module inside /modules/plugins folder
the modules have to return a class


	function myPlugin() {
		//constructor code
		...
	}

	myPlugin.prototype = {
		_bN_name: "myPluginName",
		_bN_clientCode: function(){
			//all content inside this function will be send and digest by client
			...
		}
	}

	module.exports = myPlugin;

The example above is a minimum structure for a plugin

the module file name and the \_bN\_name value must match (uppercase lowercase doesn't matter...)

And for everything to work, you just need to tell users to import it

	bN().import("jQuery");
or 

	bN().import(["first_plugin","secondPlugin",....]);

You can config your plugin right the moment you import it

	bN().import("superPlugin", {
		config1: true,
		config2: 125123,
		config3: "sssss"
	});

Or call a method within your plugin:

	var options = {
		config1: true,
		config2: 125123,
		config3: "sssss"
	}
	bN("myPlugin").init(options);

I kinda twisted this system toward being a framework, so if you call
	
	var port = 8080;
	bN().init(port);

It will create a server at the provided port. The syntax is designed to be very flexible, you can chain everything...

	bN().init(port).import("jQuery")....;




======Where this is going?======

I'm working on some more plugin (a database plugin which will synconize client HTML5 localStorage with online database, and an AUTH token-based system too...)

Can you picture it? It's a very light-weight, scalable nodejs framework that can provide you with very powerful tools with a single import statement!!!

Oh yeah, that's what i'm talking about!!!




======License?======

Even though I still want you to give me a BUZZ when you intend to use, or play around with it,

MIT, GNU GPL, ... you name it! Basically it's free for everything!








******************

@KeoStrife
contact@keostrife.com

******************
