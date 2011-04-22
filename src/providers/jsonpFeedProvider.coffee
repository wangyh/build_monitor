getFeed = (url, callback) ->
	log("loading from #{url}")
	$.ajax({
		url: url
		dataType: 'jsonp'
		jsonpCallback: 'jsonpcallback'
		success: (data) ->
			callback(data)
	})
	
@jsonpFeedProvider = (config) ->
	url = if config.proxy then "#{config.proxy}?url=#{config.url}" else url
	return (callback) ->
		getFeed(url, (data) -> callback(data.projects.project))