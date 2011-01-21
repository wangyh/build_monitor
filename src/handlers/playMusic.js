var playMusic = function($){
	function play(config){
		$('audio').remove();
		var audio = document.createElement('audio');
		$(audio).attr('controls', 'controls');
		$(audio).appendTo($('body'));
		audio.src = config.url;
		audio.play();
		audio.currentTime = config.start;
	}
	
	return function(config){
		return function(projects){
			if(projects.any(function(project){ return project.lastbuildstatus === "Failure"})){
				play(config.failed);
			}
			else{
				play(config.success);
			}
		}
	}
}(jQuery);