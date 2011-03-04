var tableView = function($){
	var template = "background: -moz-linear-gradient(100% 100% 90deg, {lightcolor}, {darkcolor}); background: -webkit-gradient(linear, 0% 0%, 0% 100%, from({darkcolor}), to({lightcolor}));-moz-border-radius: 5px ;-webkit-border-radius: 5px;"
	var green = template.replace(/{lightcolor}/g, '#0e0').replace(/{darkcolor}/g, '#090');
	var yellow = template.replace(/{lightcolor}/g, '#ee0').replace(/{darkcolor}/g, '#990');
	var red = template.replace(/{lightcolor}/g, '#e00').replace(/{darkcolor}/g, '#900');
	
	function removeDom() {
		$('#status').remove();	
	}
	
	function createDom(data){
		var dom = $('<table id="status" style="color:#333;" width="100%" cellpadding="5" />');
		var caption = $('<h2>').html(data.name);
		$('<caption>').append(caption).appendTo(dom);
		data.projects.eachProject(function(item){
			var row = $('<tr/>');
			var cell = $('<td>');
			cell.html(item.name).appendTo(row);
			var color = item.isBuilding() ? yellow : 
						item.isSuccessful() ? green : 
						red;
			cell.attr('style', color);
			row.appendTo(dom);
		});
		dom.appendTo($('body'));	
	}
	
	return function(){
		return function(data){
				removeDom();
				createDom(data);
			}
		};
}(jQuery);