{spawn, exec} = require 'child_process'

folders = [
		'/'
		'/providers/'
		'/handlers/'
	]

task 'clean', 'clean build artifects', (options) ->
	exec("rm -rf ./build")
			
task 'build', 'build the project', (options) ->
	for folder in folders
		do (folder) ->
			exec("coffee -o ./build#{folder} -c ./src#{folder}*.coffee")
	
	
	