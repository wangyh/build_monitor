var cruiseJsonpFeedProvider = function($){
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
			getFeed(config.url, callback);
		}
	}
}(jQuery);