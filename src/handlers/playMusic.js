var playMusic = function($){
	function play(config){
		var startTime = config.start || 0;
		var endTime = config.stop;
		 
		$('audio').remove();
		var audio = document.createElement('audio');
		//$(audio).attr('controls', 'controls');
		$(audio).appendTo($('body'));
		audio.src = config.url;
		waitForCondition(function(){
				return audio.duration;
			}, 
			function(){
				audio.currentTime = startTime;
				audio.play();
				if(endTime){
					waitForCondition(function(){
									return audio.currentTime >= Math.min(endTime, audio.duration);
								},
								function(){
									audio.pause();
								});
				}
		});
	}
	
	function waitForCondition(condition, callback){
		setTimeout(function(){
				if(condition()){
					callback();
				}
				else{
					waitForCondition(condition, callback);
				}
		}, 1000);
	}
	
	return function(config){
		return function(data){
			if(data.changedProjects.failed.length && config.failed){
				play(config.failed);
			} else if(data.changedProjects.failedAgain.length && config.failedAgain){
				play(config.failedAgain);
			} else if(data.changedProjects.successful.length && config.successful){
				play(config.successful);
			} else if(data.changedProjects.fixed.length && config.fixed){
				play(config.fixed);
			}
		}
	}
}(jQuery);
