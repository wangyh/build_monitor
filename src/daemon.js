function newDaemon(){
	var pollInterval;
	var feedProvider;
	var handlers;
	var name;
	var lastProjectStatus;
	var jobQueue = [];
	var filter;
		
	function getInterestedProjects(projectsJson,filter){
		var projects = filter ? new Projects(projectsJson).grepByFilter(filter)
							  : new Projects(projectsJson);

		return projects;
	}

	function run(){
		poll();
		exec();
	}
	function poll(){
		feedProvider(function(projectJson){
			var projects = getInterestedProjects(projectJson, filter);
			jobQueue.push(projects);
		});	
		
		setTimeout(function(){
			poll();
		}, pollInterval * 1000);		
	}
	
	function exec(){
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
			exec();
		}, 1000);
	}
	
	return {
		start: function(config){
			name = config.name || "Unknown Project";
			pollInterval = config.interval || 60;
			feedProvider = config.feedProvider;
			handlers = config.handlers || [];
			filter = config.filter;
			run();
		}
	};
}



function Projects(projectsJson){
	this.projects = projectsJson.map(function(project){return new Project(project)});
	this.projectMap = {};
	var self = this;
	this.projects.each(function(prj){
		self.projectMap[prj.name] = prj;
	});
}

Projects.prototype = {
	grepByFilter: function(filter){
		var includes = filter.include || [];
		var excludes = filter.exclude || [];
 		return new Projects(this.projects
			.findAll(function(prj){return prj.match(includes) && (excludes.length === 0  || !prj.match(excludes))})
			.map(function(prj){return prj.json})
		);
	},
	getChangedProjects: function(lastStatus){
		function getAllChangedProjects(currentStatus, lastStatus){
			return currentStatus.projects.findAll(function(prj){
				return lastProjectStatus(prj) && lastProjectStatus(prj).buildtime !== prj.buildtime;
			});
		}
		function lastProjectStatus(prj){
			return lastStatus.projectMap[prj.name];
		}
		var changed = getAllChangedProjects(this, lastStatus);
		return {
			failed: changed.findAll(function(prj){return lastProjectStatus(prj).isSuccessful() && prj.isFailed()}),
			successful: changed.findAll(function(prj){return lastProjectStatus(prj).isSuccessful() && prj.isSuccessful()}),
			fixed: changed.findAll(function(prj){return lastProjectStatus(prj).isFailed() && prj.isSuccessful()}),
			failedAgain: changed.findAll(function(prj){return lastProjectStatus(prj).isFailed() && prj.isFailed()})
		};
	},
	
	isFailed: function(){
		return this.projects.any(function(prj){return prj.isFailed()});
	},
	
	isSuccessful: function(){
		return !this.isFailed();
	},
	
	isBuilding: function(){
		return this.projects.any(function(prj){return prj.isBuilding()});
	},
	
	failedProjects: function(){
		return this.projects.findAll(function(prj){return prj.isFailed()});
	},
	
	successfulProjects: function(){
		return this.projects.findAll(function(prj){return prj.isSuccessful()});
	}
};

function Project(projectJson){
	this.json = projectJson;
	this.name = projectJson.name;
	this.activity = projectJson.activity;
	this.url = projectJson.weburl;
	this.status = projectJson.lastbuildstatus;
	this.buildtime = projectJson.lastbuildtime;
	this.label = projectJson.lastbuildlabel;
}

Project.prototype = {
	isFailed: function(){
		return this.status === "Failure";
	},
	
	isSuccessful: function(){
		return this.status === "Success";
	},
	
	match: function(regExs){
		if(regExs.length === 0){
			return true;
		}
		var self = this;
		return regExs.any(function(regEx){ return regEx.test(self.name);});
	},
	
	isBuilding: function(){
		return this.activity === "Building";
	}
}
