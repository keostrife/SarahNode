/* Sample of a plugin
 *
 */

var _jQueryMethodList = ["andSelf", "size", "outerWidth", "width", "innerWidth", "outerHeight", "height", "innerHeight", "scrollTop", "scrollLeft", "offsetParent", "position", "offset", "fadeToggle", "fadeOut", "fadeIn", "slideToggle", "slideUp", "slideDown", "finish", "stop", "animate", "fadeTo", "ajaxSend", "ajaxSuccess", "ajaxError", "ajaxComplete", "ajaxStop", "ajaxStart", "undelegate", "delegate", "unbind", "bind", "hover", "contextmenu", "error", "keyup", "keypress", "keydown", "submit", "select", "change", "mouseleave", "mouseenter", "mouseout", "mouseover", "mousemove", "mouseup", "mousedown", "dblclick", "click", "unload", "scroll", "resize", "load", "focusout", "focusin", "focus", "blur", "serializeArray", "serialize", "toggle", "hide", "show", "css", "unwrap", "wrap", "wrapInner", "wrapAll", "replaceAll", "insertAfter", "insertBefore", "prependTo", "appendTo", "domManip", "detach", "replaceWith", "html", "clone", "empty", "remove", "after", "before", "prepend", "append", "text", "contents", "children", "siblings", "prevUntil", "nextUntil", "prevAll", "nextAll", "prev", "next", "parentsUntil", "parents", "parent", "addBack", "add","constructor", "init", "toArray", "get", "pushStack", "each", "ready", "slice", "first", "last", "eq", "map", "end", "push", "sort", "splice", "extend", "data", "removeData", "queue", "dequeue", "delay", "clearQueue", "promise", "attr", "removeAttr", "prop", "removeProp", "addClass", "removeClass", "toggleClass", "hasClass", "val", "on", "one", "off", "trigger", "triggerHandler", "find", "has", "not", "filter", "is", "closest", "index"]

function _convertToText(input) {
    var string = [];

    //is object
    if (typeof(input) == "object" && (input.join == undefined)) {
        string.push("{");
        for (prop in input) {
            string.push(prop, ": ", _convertToText(input[prop]), ",");
        };
        string.push("}");

    //is array
    } else if (typeof(input) == "object" && !(input.join == undefined)) {
        string.push("[")
        for(prop in input) {
            string.push(_convertToText(input[prop]), ",");
        }
        string.push("]")

    //is function
    } else if (typeof(input) == "function") {
        string.push(input.toString())

    } else if (typeof(input) == "string"){
        string.push("'"+input+"'")
    }

    return string.join("")
}

//options are arguments passed down when plugin 
function jQuery(selector, socket) {
	this.socket = socket;
	this.selector = selector;

	for(var i = 0, iLen = _jQueryMethodList.length;i<iLen;i++) {
		var currentMed = _jQueryMethodList[i];

		jQuery.prototype[currentMed] = (function(currentMed){
			return function(){
				var args = []
				for(var g = 0; g<arguments.length; g++)
					args.push(_convertToText(arguments[g]));

				this.socket.emit("jQuery", 
					"$('"+this.selector+"')."+currentMed+"("+args.join(",")+");"
				);

				return this;
			}	
		}(currentMed));

	}
}




jQuery.prototype = {
	_bN_name: "jQuery",
	_bN_clientCode: function(){
		//this code will go to client
		IO.on("jQuery", function(data){
			eval(data);
		});
	},
	_bN_init: function(){
		//this function will get run automatically after the class is instanciated
	}
}

global.$ = function(selector, socket){
	return new jQuery(selector, socket);
}

module.exports = jQuery;

