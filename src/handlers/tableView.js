var tableView = function($){
	var template = "margin:3px; padding:3px; height:30px; line-height:30px; list-style:none; background: -moz-linear-gradient(100% 100% 90deg, {lightcolor}, {darkcolor}); background: -webkit-gradient(linear, 0% 0%, 0% 100%, from({darkcolor}), to({lightcolor}));-moz-border-radius: 5px ;-webkit-border-radius: 5px;"
	var green = template.replace(/{lightcolor}/g, '#0e0').replace(/{darkcolor}/g, '#090');
	var yellow = template.replace(/{lightcolor}/g, '#ee0').replace(/{darkcolor}/g, '#990');
	var red = template.replace(/{lightcolor}/g, '#e00').replace(/{darkcolor}/g, '#900');
	
	function removeDom(root) {
		root.find('#status').remove();	
	}
	
	function createDom(data, root){
		var content = $('<div id="status" />');
		var caption = $('<h2 style="text-align:center">').html(data.name);
		var ul = $('<ul style="color:#333; padding:0; margin:0;" />');
		
		data.projects.eachProject(function(item){
			var li = $('<li/>');
			li.html(item.name);
			var color = item.isBuilding() ? yellow : 
						item.isSuccessful() ? green : 
						red;
			li.attr('style', color);
			ul.append(li);
		});
		content.append(caption).append(ul).appendTo(root);
	}
	
	return function(container){
		var root = container || $('body');
		return function(data){
				removeDom(root);
				createDom(data, root);
			}
		};
}(jQuery);