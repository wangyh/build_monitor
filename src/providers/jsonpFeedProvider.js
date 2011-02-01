var jsonpFeedProvider = (function($){
	function getFeed(url, callback){
		$.ajax({
			url: url,
			dataType: 'jsonp',
			jsonpCallback: 'jsonpcallback',
			success: function(data){
				callback(data);
			}
		});
	}
	
	return function(config){
		var url = config.proxy? [config.proxy, '?url=', config.url].join('') : url; 
		return function(callback){
			getFeed(url, function(data){
				callback(data.projects.project);
			});
		}
	}
})(jQuery);