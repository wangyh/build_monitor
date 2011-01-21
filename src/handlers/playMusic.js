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
	
	lastStatus = null;
	return function(config){
		return function(projects){
			if(!lastStatus){
				if(projects.any(function(project){ return project.lastbuildstatus === "Failure"})){
					play(config.failed);
				}
				else{
					play(config.success);
				}
				lastStatus = projects;
				return;
			}
			
			for(var i=0; i<projects.length; i++){
				var current = projects[i];
				var last = lastStatus.findAll(function(project){
					project.name === current.name;
				});
				
				if(last.length > 0 && current.lastbuildstatus !== last[0].lastbuildstatus){
					play(current.lastbuildstatus === "Failure"? config.failed: config.success);
					break;
				}
			}
			
			lastStatus = projects;
		}
	}
}(jQuery);