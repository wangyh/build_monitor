Array.prototype.each = function(func){
	for(var i=0; i<this.length; i++){
		func(this[i]);
	}
}

Array.prototype.map = function(func){
	var result = [];
	for(var i=0;i<this.length;i++){
		result.push(func(this[i]));
	}
	return result;
}

Array.prototype.findAll = function(predicate){
	var result = [];
	for(var i=0; i<this.length; i++){
		if(predicate(this[i])){
			result.push(this[i]);
		}
	}
	return result;
}

Array.prototype.any = function(predicate){
	for(var i=0; i<this.length; i++){
		if(predicate(this[i])){
			return true;
		}
	}
	return false;
}
function newDeamon(){
	var pullInterval = 5 * 1000;
	var feedProvider;
	var handlers = [];
	var intervalId;
	var pipelines;
		
	function poll(){
		intervalId = setInterval(run, pullInterval);
		run();
	}
	
	function run(){
		feedProvider(function(projects){
			var projectsToHandle = pipelines
			? projects.findAll(function(project){
				return pipelines.any(function(pipeline){
						return project.name.indexOf(pipeline + " ::") === 0;
					});
			})
			: projects;
			handlers.each(function(handler){
				handler(projectsToHandle);
			});
		});
	}
	return {
		addHandler: function(handler){
			handlers.push(handler);
			return this;
		},
		
		feedProvider: function(theFeedProvider){
			feedProvider = theFeedProvider;
			return this;
		},
		
		pipeline:function(config){
			pipelines = config;
			return this;
		},
		start :function(interval){
			if(interval){
				pullInterval = interval;
			}
			poll();
			return this;
		}, 
		
		stop: function(){
			clearInterval(intervalId);
			return this;
		}
	};
}