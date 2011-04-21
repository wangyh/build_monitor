function newDaemon(){
	var lastProjectStatus;
	var jobQueue = [];
	var config;
	var pollTimeoutId, execTimeoutId;
		
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
		config.feedProvider(function(projectJson){
			var projects = getInterestedProjects(projectJson, config.filter);
			jobQueue.push(projects);
		});	
		
		setTimeout(function(){
			poll();
		}, config.interval * 1000);		
	}
	
	function exec(){
		if(jobQueue.length > 0)
		{
			var projects = jobQueue.shift();
			var changedProjects= lastProjectStatus? projects.getChangedProjects(lastProjectStatus) 
												  :{failed:[], fixed:[], successful:[], failedAgain:[]};
			lastProjectStatus = projects;

			_.each(config.handlers, function(handler){
				handler({
					name: config.name, 
					projects: projects, 
					changedProjects: changedProjects
				});
			});
		}
		setTimeout(function(){
			exec();
		}, 1000);
	}
	
	
	function merge(config){
		return {
			name : config.name || "UNKNOWN PROJECT",
			feedProvider: config.feedProvider,
			handlers: config.handlers || [],
			filter : config.filter || {},
			interval : config.interval || 30
		};
	}
	
	return {
		start: function(theConfig){
			this.stop();
			config = merge(theConfig);
			run();
		},
		
		stop: function(){
			clearTimeout(pollTimeoutId);
			clearTimeout(execTimeoutId);
			jobQueue = [];
		}
	};
}


function Projects(projectsJson){
	this.projects = _.map(projectsJson, function(project){return new Project(project)});
	this.projectMap = {};
	var self = this;
	_.each(this.projects, function(prj){
		self.projectMap[prj.name] = prj;
	});
}

Projects.prototype = {
	grepByFilter: function(filter){
		var includes = filter.include || [];
		var excludes = filter.exclude || [];
 		return new Projects(_(this.projects)
			.select(function(prj){return prj.match(includes) && (excludes.length === 0  || !prj.match(excludes))})
			.map(function(prj){return prj.json})
		);
	},
	getChangedProjects: function(lastStatus){
		function getAllChangedProjects(currentStatus, lastStatus){
			return _(currentStatus.projects).select(function(prj){
				return lastProjectStatus(prj) && lastProjectStatus(prj).buildtime !== prj.buildtime;
			});
		}
		function lastProjectStatus(prj){
			return lastStatus.projectMap[prj.name];
		}
		var changed = getAllChangedProjects(this, lastStatus);
		return {
			failed: _.select(changed, function(prj){return lastProjectStatus(prj).isSuccessful() && prj.isFailed()}),
			successful: _.select(changed, function(prj){return lastProjectStatus(prj).isSuccessful() && prj.isSuccessful()}),
			fixed: _.select(changed, function(prj){return lastProjectStatus(prj).isFailed() && prj.isSuccessful()}),
			failedAgain: _.select(changed, function(prj){return lastProjectStatus(prj).isFailed() && prj.isFailed()})
		};
	},
	
	eachProject: function(callback){
		_.each(this.projects, callback);
	},
	
	isFailed: function(){
		return _.any(this.projects, function(prj){return prj.isFailed()});
	},
	
	isSuccessful: function(){
		return !this.isFailed();
	},
	
	isBuilding: function(){
		return _.any(this.projects, function(prj){return prj.isBuilding()});
	},
	
	failedProjects: function(){
		return _.select(this.projects, function(prj){return prj.isFailed()});
	},
	
	successfulProjects: function(){
		return _.select(this.projects, function(prj){return prj.isSuccessful()});
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
		return _.any(regExs, function(regEx){ return regEx.test(self.name);});
	},
	
	isBuilding: function(){
		return this.activity === "Building";
	}
}
