function newDeamon(){
	var pullInterval;
	var feedProvider;
	var handlers;
	var intervalId;
	var pipelines;
	var name;
		
	function poll(){
		clearInterval(intervalId);
		intervalId = setInterval(run, pullInterval * 1000);
		run();
	}
	
	function run(){
		feedProvider(function(projectsJson){
			var projects = pipelines ? new Projects(projectsJson).filterByPipelines(pipelines)
									 : new Projects(projectsJson);
			handlers.each(function(handler){
				handler({name: name, projects: projects});
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
}

Projects.prototype = {
	filterByPipelines: function(pipelines){
		return new Projects(this.projects
			.findAll(function(prj){return prj.belongsTo(pipelines)})
			.map(function(prj){return prj.json})
		);
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