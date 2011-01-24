var simpleView = function($){
	return function(projects){
		var color = projects.isBuilding() ? 'yellow' :
					projects.isSuccessful() ? 'green' :
					'red';
		$('body').css('background-color', color);
	}
}(jQuery)