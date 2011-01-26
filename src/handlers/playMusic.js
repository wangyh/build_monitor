var playMusic = function($){
	function play(config){
		$('audio').remove();
		var audio = createAudioElement(config);
		var startTime = config.start || 0;
		var endTime = config.stop;
		
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
	
	function createAudioElement(config){
			var audio = document.createElement('audio');
			$(audio).attr('controls', 'controls');
			var sources = (config.url instanceof Array ? config.url : [config.url]);
			sources.each(function(ele){
				$('<source>')
				.attr('src', ele)
				.attr('type', /.mp3$/.test(ele) ? 'audio/mpeg' : /.ogg$/.test(ele) ? 'audio/ogg' : '')
				.appendTo($(audio));
			});
			$(audio).appendTo($('body'));
		return audio;
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
