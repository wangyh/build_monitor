function newDaemon(){
	var pollInterval;
	var feedProvider;
	var handlers;
	var name;
	var lastProjectStatus;
	var jobQueue = [];
		
	function run(){
		poll();
		startJobs();
	}
	function poll(){
		feedProvider(function(job){
			jobQueue.push(job);
		});	
		
		setTimeout(function(){
			poll();
		}, pollInterval * 1000);		
	}
	
	function startJobs(){
		if(jobQueue.length > 0)
		{
			var projects = jobQueue.shift();
			var changedProjects= lastProjectStatus? projects.getChangedProjects(lastProjectStatus) 
												  :{failed:[], fixed:[], successful:[], failedAgain:[]};
			lastProjectStatus = projects;

			handlers.each(function(handler){
				handler({
					name: name, 
					projects: projects, 
					changedProjects: changedProjects
				});
			});
		}
		setTimeout(function(){
			startJobs();
		}, 1000);
	}
	
	return {
		start: function(config){
			name = config.name || "Unknown Project";
			pollInterval = config.interval || 60;
			feedProvider = config.feedProvider;
			handlers = config.handlers || [];
			run();
		}
	};
}
