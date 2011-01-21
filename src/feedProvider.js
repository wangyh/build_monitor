var feedProvider = function($){
	return function(xml){
		$(xml).appendTo($("<div id='feed'/>")).appendTo($("body"));
		var projects = $.map($('Project'), function(ele){
			var project = $(ele);
			return {
				name: project.attr('name'),
				activity: project.attr('activity'),
				lastStatus: project.attr('lastBuildStatus'),
				lastBuildLabel: project.attr('lastBuildLabel'),
				lastBuildTime: project.attr('lastBuildTime'),
				webUrl: project.attr('webUrl')
			}
		});
		$('#feed').remove();
		return projects;
	};
}(jQuery);