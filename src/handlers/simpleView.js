var simpleView = function($){
	return function(data){
		var color = data.projects.isFailed() ? 'red' :
					data.projects.isBuilding() ? 'yellow' :
					'green';
		$('body').css('background-color', color);
	}
}(jQuery)