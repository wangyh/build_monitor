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
	
	it("should be able to know if project belongs to specific pipeline", function(){
		expect(createProject({name:"Pipeline :: Stage"}).belongsTo(["Pipeline", "anotherPipeline"])).toBeTruthy();
		expect(createProject({name:"foo :: bar"}).belongsTo(["Pipeline", "anotherPipeline"])).toBeFalsy();
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
		
		var job = createProject({name: "Pipeline :: Stage :: Job"});
		expect(job.pipeline).toEqual("Pipeline");
		expect(job.stage).toEqual("Stage");
		expect(job.job).toEqual("Job");
	});
})