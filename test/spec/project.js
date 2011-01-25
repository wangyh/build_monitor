describe("Project", function(){
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
	
	it("should be able to get pipeline, stage and job name", function(){
		var stage = createProject({name: "Pipeline :: Stage"});
		expect(stage.pipeline).toEqual("Pipeline");
		expect(stage.stage).toEqual("Stage");
		expect(stage.job).toEqual("");
		
		var job = createProject({name: "Jan-Release-Smoke :: Prebuild-Packages-For-Following-Stages"});
		expect(job.pipeline).toEqual("Jan-Release-Smoke");
		expect(job.stage).toEqual("Prebuild-Packages-For-Following-Stages");
		expect(job.job).toEqual("");
		
		var job = createProject({name: "Jan-Release-Smoke :: Prebuild-Packages-For-Following-Stages :: prebuild-packages"});
		expect(job.pipeline).toEqual("Jan-Release-Smoke");
		expect(job.stage).toEqual("Prebuild-Packages-For-Following-Stages");
		expect(job.job).toEqual("prebuild-packages");
	});
	
	it("should be able to get current activity", function(){
		var project_1 = createProject({name: "Pipeline :: Stage", activity: "Building"});
		expect(project_1.isBuilding()).toBeTruthy();
	
		var project_2 = createProject({name: "Pipeline :: Stage", activity: "Sleeping"});
		expect(project_2.isBuilding()).toBeFalsy();
	
	});
})