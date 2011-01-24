var simpleView = function($){
	return function(data){
		var color = data.projects.isBuilding() ? 'yellow' :
					data.projects.isSuccessful() ? 'green' :
					'red';
		$('body').css('background-color', color);
	}
}(jQuery)