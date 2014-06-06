var Sarah = function(){

	return {
		init: function() {
			$("#ask").click(function(){
				var command = $("#command").val();
				var commandInput = $("#commandInput").val();
				if(command && commandInput) {
					bN.emit("command", {command: command, commandInput: commandInput});
				}
			});
		}
	}
}();

$(document).ready(function(){
	bN.init();
	Sarah.init();
});