function staticConfig(config){
	return {
		getConfig: function(){
			return {
				name : config.name || "UNKNOWN PROJECT",
				feedProvider: config.feedProvider,
				handlers: config.handlers || [],
				filter : config.filter || {},
				interval : config.interval || 30
			};
		}
	}
}

function dynamicConfig(){
	var storage = window.localStorage || {};
	
	localStorage["config.interval"] = config.interval || 30;
	localStorage["config.filter.include"] = JSON.stringify((config.filter && config.filter.include) ? config.filter.include : []);
	localStorage["config.filter.exclude"] = JSON.stringify((config.filter && config.filter.exclude)? config.filter.exclude: []);
	localStorage["config.name"] = config.name || "UNKNOWN PROJECT";
	return {
		getConfig: function(){
			return {
				name: localStorage["config.name"],
				feedProvider: config.feedProvider,
				handlers: config.handlers || [],
				filter: {include: JSON.parse(localStorage["config.filter.include"]), exclude: JSON.parse(localStorage["config.filter.exclude"])},
				interval: localStorage["config.interval"]
			}
		}
	}
}