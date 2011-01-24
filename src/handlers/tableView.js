var tableView = function($){
	function removeDom() {
		$('#status').remove();	
	}
	
	function createDom(data){
		var dom = $('<table id="status" style="color:white" width="100%" cellpadding="5"/>');
		$('<caption>').html(data.name).appendTo(dom);
		var stages = data.projects.projects.findAll(function(prj){
			return prj.job === "";
		});
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
		console.log(data)
		$('body').css('background-color', 'gray');
		removeDom();
		createDom(data);
	}
}(jQuery);