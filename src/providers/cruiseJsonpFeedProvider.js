var createCruiseJsonpFeedProvider = function($){
	function getFeed(url, callback){
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function(data){
				callback(data);
			}
		});
	}
	
	return function(config){
		return function(callback){
			getFeed(config.proxy + '?url=' + config.url, function(data){
				callback(data.projects.project);
			});
		}
	}
}

var cruiseJsonpFeedProvider = createCruiseJsonpFeedProvider(jQuery);
