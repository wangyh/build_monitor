{spawn, exec} = require 'child_process'

folders = [
		'/'
		'/providers/'
		'/handlers/'
	]

task 'clean', 'clean build artifects', (options) ->
	for folder in folders
		do (folder) ->
			exec("rm ./src#{folder}*.js")
			
task 'build', 'build the project', (options) ->
	for folder in folders
		do (folder) ->
			exec("coffee -o ./src#{folder} -c ./coffeescript#{folder}*.coffee")
	
	
	