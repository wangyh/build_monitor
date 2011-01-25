var tableView = function($){
	function removeDom() {
		$('#status').remove();	
	}
	
	function createDom(data){
		var dom = $('<table id="status" style="color:white; background-color:gray" width="100%" cellpadding="5" />');
		$('<caption>').html(data.name).appendTo(dom);
		var stages = data.projects.projects;
		stages.each(function(stage){
			var row = $('<tr/>');
			$('<td>').html(stage.name).appendTo(row);
			var color = stage.isBuilding() ? 'yellow' : 
						stage.isSuccessful() ? 'green' : 
						'red';
			row.css('background-color', color);
			row.appendTo(dom);
		});
		dom.appendTo($('body'));	
	}
	
	return function(data){
		removeDom();
		createDom(data);
	}
}(jQuery);