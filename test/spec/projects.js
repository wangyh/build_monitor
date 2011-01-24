describe("Projects", function(){
	var projects_1, projects_2;
	beforeEach(function(){
		projects_1 = new Projects(
			[
				{lastbuildstatus: "Success", name:"Pipeline1 :: Stage1", activity: "Sleeping"},
				{lastbuildstatus: "Failure", name:"Pipeline1 :: Stage2", activity: "Sleeping"}
			]);

		projects_2 = new Projects(
			[
				{lastbuildstatus: "Success", name:"Pipeline2 :: Stage1", activity: "Sleeping"},
				{lastbuildstatus: "Success", name:"Pipeline2 :: Stage2", activity: "Building"}
			]);
	});
	
	it("should be able know if there is failed project", function(){
		expect(projects_1.isFailed()).toBeTruthy();
		expect(projects_1.isSuccessful()).toBeFalsy();
		
		expect(projects_2.isFailed()).toBeFalsy();
		expect(projects_2.isSuccessful()).toBeTruthy();
	});
	
	it("should be able to get all failed projects", function(){
		expect(projects_1.failedProjects().length).toEqual(1);
		expect(projects_2.failedProjects().length).toEqual(0);
	});
	
	it("should be able to get all successful projects", function(){
		expect(projects_1.successfulProjects().length).toEqual(1);
		expect(projects_2.successfulProjects().length).toEqual(2);
	});
	
	it("should be able to select pipelines", function(){
		var projects_3 = new Projects(
			[
				{lastbuildstatus: "Success", name:"Pipeline1 :: Stage1"},
				{lastbuildstatus: "Success", name:"Pipeline2 :: Stage2"},
				{lastbuildstatus: "Success", name:"Pipeline3 :: Stage3"},
				{lastbuildstatus: "Success", name:"Pipeline4 :: Stage1"}
			]);
		expect(projects_3.filterByPipelines(["Pipeline1"]).projects.length).toEqual(1);
		expect(projects_3.filterByPipelines(["Pipeline1"]).projects[0].name).toEqual("Pipeline1 :: Stage1");
		
		expect(projects_3.filterByPipelines(["Pipeline1", "Pipeline2"]).projects.length).toEqual(2);
		expect(projects_3.filterByPipelines(["Pipeline1", "Pipeline2"]).projects[0].name).toEqual("Pipeline1 :: Stage1");
		expect(projects_3.filterByPipelines(["Pipeline1", "Pipeline2"]).projects[1].name).toEqual("Pipeline2 :: Stage2");
	});
	
	it("should be able to know is there is project building", function(){
		expect(projects_1.isBuilding()).toBeFalsy();
		expect(projects_2.isBuilding()).toBeTruthy();
	});
});
