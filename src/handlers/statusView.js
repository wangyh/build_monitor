var statusView = function($){
	function removeDom() {
		$('#status').remove();	
	}
	
	function createDom(projects){
		var dom = $('<table id="status"/>');
		for(var i=0; i< projects.length; i++){
			var project = projects[i];
			var row = $('<tr/>');
			$('<td>').append($('<a>').attr('href', project.weburl).html(project.name)).appendTo(row);
			$('<td>').html(project.activity).appendTo(row);
			$('<td>').html(project.lastbuildlabel).appendTo(row);
			$('<td>').html(project.lastbuildtime).appendTo(row);
			var color = project.lastbuildstatus === "Success"? 'green' : 'red';
			row.css('background-color', color);
			dom.append(row);
		}
		dom.appendTo($('body'));
	}
	
	return function(projects){
		removeDom();
		createDom(projects);
	}
}(jQuery);