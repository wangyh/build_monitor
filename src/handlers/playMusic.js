var playMusic = function($){
	function play(config){
		$('audio').remove();
		var audio = document.createElement('audio');
	//	$(audio).attr('controls', 'controls');
		$(audio).appendTo($('body'));
		audio.src = config.url;
		waitForLoad(audio, function(){
			audio.currentTime = config.start;
			audio.play();
		});
	}
	
	function waitForLoad(audio, callback){
		setTimeout(function(){
				if(audio.duration){
					callback();
				}
				else{
					waitForLoad(audio, callback);
				}
		}, 1000);
	}
	
	return function(config){
		return function(data){
			if(data.changedProjects.failed.length + data.changedProjects.failedAgain.length > 0){
				play(config.failed);
			} else if(data.changedProjects.successful.length + data.changedProjects.fixed.length > 0){
				play(config.success);
			}
		}
	}
}(jQuery);