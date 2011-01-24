var createCruiseJsonpFeedProvider = function($){
	function getFeed(url, callback){
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function(data){
				callback(data.projects.project);
			}
		});
	}
	return function(config){
		return function(callback){
			getFeed(config.proxy + '?url=' + config.url, callback);
		}
	}
}

var cruiseJsonpFeedProvider = createCruiseJsonpFeedProvider(jQuery);
