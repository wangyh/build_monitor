var playMusic = function($){
	function play(config){
		$('audio').remove();
		var audio = document.createElement('audio');
	//	$(audio).attr('controls', 'controls');
		$(audio).appendTo($('body'));
		audio.src = config.url;
		waitForCondition(function(){
				return audio.duration
			}, 
			function(){
				audio.currentTime = config.start;
				audio.play();
				waitForCondition(function(){
					return audio.currentTime >= config.stop
				},
				function(){
					audio.pause();
				});
		});
	}
	
	function waitForCondition(condition, callback){
		setTimeout(function(){
				if(condition()){
					callback();
				}
				else{
					waitForCondition.apply(this, Array.prototype.slice(arguments));
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
