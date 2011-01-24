function newDaemon(){
	var pullInterval;
	var feedProvider;
	var handlers;
	var intervalId;
	var pipelines;
	var name;
	var lastProjectStatus;
		
	function poll(){
		clearInterval(intervalId);
		intervalId = setInterval(run, pullInterval * 1000);
		run();
	}
	
	function run(){
		feedProvider(function(projectsJson){
			var projects = pipelines ? new Projects(projectsJson).filterByPipelines(pipelines)
									 : new Projects(projectsJson);
									
			var changedProjects= lastProjectStatus? projects.getChangedProjects(lastProjectStatus) 
												  :{failed:[], fixed:[], successful:[], failedAgain:[]};
			lastProjectStatus = projects;

			handlers.each(function(handler){
				handler({name: name, projects: projects, changedProjects: changedProjects});
			});
		});
	}
	return {
		start: function(config){
			name = config.name || "Unknown Project";
			pullInterval = config.interval || 60;
			feedProvider = config.feedProvider;
			handlers = config.handlers || [];
			pipelines = config.pipelines;
			poll();
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
	filterByPipelines: function(pipelines){
		return new Projects(this.projects
			.findAll(function(prj){return prj.belongsTo(pipelines)})
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
	
	this.pipeline = projectJson.name.replace(/^(\S+)\s*::.*/, "$1");
	this.stage = projectJson.name.replace(/^(\S+)\s*::\s*(\S+)( :: (\S+))?$/, "$2");
	this.job = projectJson.name.replace(/^(\S+)\s*::\s*(\S+)( :: (\S+))?$/, "$4");
}

Project.prototype = {
	isFailed: function(){
		return this.status === "Failure";
	},
	
	isSuccessful: function(){
		return this.status === "Success";
	},
	
	belongsTo: function(pipelines){
		return pipelines.contains(this.pipeline);
	},
	
	isBuilding: function(){
		return this.activity === "Building";
	}
}