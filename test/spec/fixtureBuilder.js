function createProject(attrs){
	var prj = {name: "ccHTML", activity: "Sleeping", lastbuildstatus: "Success", lastbuildtime: "2011-01-02", lastbuildlabel: "10", weburl: "http://www.foo.com"};
	if(attrs){
		for(var name in attrs){
			prj[name] = attrs[name];
		}
	}
	return new Project(prj);
}
