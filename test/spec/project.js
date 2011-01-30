describe("Project", function(){
	function createProject(attrs){
		var prj = {name: "ccHTML", activity: "Sleeping", lastbuildstatus: "Success", lastbuildtime: "2011-01-02", lastbuildlabel: "10", weburl: "http://www.foo.com"};
		if(attrs){
			for(var name in attrs){
				prj[name] = attrs[name];
			}
		}
		return new Project(prj);
	}

	it("should be able to get project properties", function(){
		var project = createProject();
		expect(project.name).toEqual("ccHTML");
		expect(project.activity).toEqual("Sleeping");
		expect(project.status).toEqual("Success");
		expect(project.buildtime).toEqual("2011-01-02");
		expect(project.label).toEqual("10");
		expect(project.url).toEqual("http://www.foo.com");
	});
	
	it("should be able to know if project name match patterns", function(){
		expect(createProject({name:"Pipeline :: Stage"}).match([])).toBeTruthy();
		expect(createProject({name:"Pipeline :: Stage"}).match([/Pip/, /not match/])).toBeTruthy();
		expect(createProject({name:"Pipeline :: Stage"}).match([/Pipeline :: Stage/])).toBeTruthy();
		expect(createProject({name:"foo :: bar"}).match([/foo1/])).toBeFalsy();
	});
	
	it("should be able to know if it's success or failed", function(){
		var failed_project = createProject({lastbuildstatus: "Failure"});
		expect(failed_project.isFailed()).toBeTruthy();
		expect(failed_project.isSuccessful()).toBeFalsy();
		
		var success_project = createProject({lastbuildstatus: "Success"});
		expect(success_project.isFailed()).toBeFalsy();
		expect(success_project.isSuccessful()).toBeTruthy();
	});
	
	
	it("should be able to get current activity", function(){
		var project_1 = createProject({name: "Pipeline :: Stage", activity: "Building"});
		expect(project_1.isBuilding()).toBeTruthy();
	
		var project_2 = createProject({name: "Pipeline :: Stage", activity: "Sleeping"});
		expect(project_2.isBuilding()).toBeFalsy();
	
	});
})