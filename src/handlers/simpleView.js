var simpleView = function($){
	return function(projects){
		$('body').css('background-color', projects.isSuccessful()? 'green': 'red');
	}
}(jQuery)