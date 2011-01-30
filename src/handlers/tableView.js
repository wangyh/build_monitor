var tableView = function($){
	function removeDom() {
		$('#status').remove();	
	}
	
	function createDom(data){
		var dom = $('<table id="status" style="color:white; background-color:gray" width="100%" cellpadding="5" />');
		$('<caption style="color:blue">').html(data.name).appendTo(dom);
		data.projects.eachProject(function(item){
			var row = $('<tr/>');
			$('<td>').html(item.name).appendTo(row);
			var color = item.isBuilding() ? 'yellow' : 
						item.isSuccessful() ? 'green' : 
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