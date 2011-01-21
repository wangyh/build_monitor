var simpleView = function($){
	function isBuildSuccessful(projects){
		for(var i=0; i<projects.length; i++){
			if(projects[i].lastbuildstatus === 'Failure'){
				return false;
			}
		}
		return true;
	}
	return function(projects){
		$('body').css('background-color', isBuildSuccessful(projects)? 'green': 'red');
	}
}(jQuery)