template = "margin:3px; padding-left:20px; height:30px; line-height:30px; list-style:none; background: -moz-linear-gradient(100% 100% 90deg, {lightcolor}, {darkcolor}); background: -webkit-gradient(linear, 0% 0%, 0% 100%, from({darkcolor}), to({lightcolor}));-moz-border-radius: 5px ;-webkit-border-radius: 5px;"
green = template.replace(/{lightcolor}/g, '#0e0').replace(/{darkcolor}/g, '#090')
yellow = template.replace(/{lightcolor}/g, '#ee0').replace(/{darkcolor}/g, '#990')
red = template.replace(/{lightcolor}/g, '#e00').replace(/{darkcolor}/g, '#900')

removeDom = (root) ->
	root.find('#status').remove()
	
createDom = (data, root) ->
	content = $('<div id="status" />')
	caption = $('<h2 style="text-align:center">').html(data.name)
	ul = $('<ul style="color:#333; padding:0; margin:0;" />')
	data.projects.eachProject((item) ->
		li = $('<li/>');
		li.html(item.name);
		color = if item.isBuilding()
					yellow 
				else if item.isSuccessful()
					green
				else
					red
		li.attr('style', color);
		ul.append(li);
	)
	content.append(caption).append(ul).appendTo(root);
	
@listView = (container) ->
	root = container or $('body')
	return (data) ->
		removeDom(root)
		createDom(data, root)