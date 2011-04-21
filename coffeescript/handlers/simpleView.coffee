@simpleView = ->
	return () ->
		return (data) ->
			color = if data.projects.isFailed() 
						'red' 
					else if data.projects.isBuilding() 
						'yellow'
					else 'green'
			$('body').css 'background-color', color