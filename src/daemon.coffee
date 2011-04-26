jobQueue = []
pollTimeoutId = null
execTimeoutId = null
config = null
lastProjectStatus = null
getInterestedProjects = (projectsJson, filter) ->
	projects = new Projects projectsJson
	projects = if filter then projects.grepByFilter(filter) else projects
	
run = () ->
	poll()
	exec()
	
poll = () ->
	log("poll...")
	config.feedProvider (projectJson) ->
							projects = getInterestedProjects(projectJson, config.filter)
							jobQueue.push(projects)
					
	pollTimeoutId = setTimeout(poll, 1000 * config.interval)

exec = () ->
	if jobQueue.length > 0
		log("update...")
		projects = jobQueue.shift()
		changedProjects = if lastProjectStatus then projects.getChangedProjects(lastProjectStatus) else failed: [], fixed: [], successful:[], failedAgain: []
		lastProjectStatus = projects
		
		handler {name: config.name,projects: projects,changedProjects: changedProjects} for handler in config.handlers
	
	execTimeoutId = setTimeout(exec, 1000)
	
newDaemon = () ->
	start: (theConfig) ->
		@stop()
		config = _.extend({name: "UNKNOWN PROJECT", handlers:[], filter: {}, interval: 30}, theConfig)
		run()
	stop: () ->
		clearTimeout(pollTimeoutId)
		clearTimeout(execTimeoutId)
		jobQueue = []
		
class Projects
	constructor: (projectsJson) ->
		@projects = (new Project(project) for project in projectsJson)
		@projectMap = {}
		for prj in @projects
			do (prj) =>
				@projectMap[prj.name] = prj
	grepByFilter: (filter) ->
		includes = filter.include or []
		excludes = filter.exclude or []
		filtered = _(@projects)
					.select((prj) -> prj.match(includes) and (excludes.length is 0 or not prj.match(excludes)))
					.map((prj) -> prj.json)
		new Projects(filtered)
		
	getChangedProjects: (lastStatus) ->
		lastProjectStatus = (prj) -> 
			lastStatus.projectMap[prj.name]
		
		getAllChangedProjects = () =>
			_.select(@projects, (prj) -> lastProjectStatus(prj) and lastProjectStatus(prj).buildtime isnt prj.buildtime)
				
		changed = getAllChangedProjects()
		
		return {
			failed: _.select(changed, (prj) -> lastProjectStatus(prj).isSuccessful() and prj.isFailed())
			successful: _.select(changed, (prj) -> lastProjectStatus(prj).isSuccessful() and prj.isSuccessful())
			fixed: _.select(changed, (prj) -> lastProjectStatus(prj).isFailed() and prj.isSuccessful())
			failedAgain: _.select(changed, (prj) -> lastProjectStatus(prj).isFailed() and prj.isFailed())
		}
	
	eachProject: (callback) -> 
		callback prj for prj in @projects
		
	isFailed: ->
		_.any(@projects, (prj) -> prj.isFailed())
		
	isSuccessful: ->
		not @isFailed()
		
	isBuilding: ->
		_.any(@projects, (prj) -> prj.isBuilding())
		
	failedProjects:  ->
		_.select(@projects, (prj) -> prj.isFailed())
	
	successfulProjects: ->
		_.select(@projects, (prj) -> prj.isSuccessful())

class Project
	constructor: (projectJson) ->
		@name = projectJson.name
		@activity = projectJson.activity
		@url = projectJson.weburl
		@status = projectJson.lastbuildstatus
		@buildtime = projectJson.lastbuildtime
		@label = projectJson.lastbuildlabel
		@json = projectJson
	
	isFailed: ->
		@status is "Failure"
		
	isSuccessful: ->
		@status is "Success"
	
	match: (regExs) ->
		return true if regExs.length is 0
		_.any(regExs, (regex) => regex.test(@name))
  
	isBuilding: ->
		@activity is "Building"
		
		
@Project = Project
@Projects = Projects
@newDaemon = newDaemon		