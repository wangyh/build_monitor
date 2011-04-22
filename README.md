build_monitor
=============

build_monitor is used to get the status and notification from continuous integration server. Currently build_monitor is only tested against [Cruise/GO](http://www.thoughtworks-studios.com/go-agile-release-management) and Hudson. But in theory it supports all CI servers which provides Cruise Control XML feed.

Prerequisite
----------
* a jsonp proxy - there are two built-in proxies located at /proxy/nodejs. 
	
	Node.js is required for proxy.js. CoffeeScript is required for proxy.coffee

	node proxy.js [port]
	
	coffee proxy.coffee [port]

* a browser support HTML5 for sound notification.

Build
-----

* build coffee script to javascript
	
	cake build

* clean 
	
	cake clean

Example
-------

Create an empty HTML file, include all the javascript source file as your need, and start a build monitor daemon with proper configuration.

	<!DOCTYPE html>
	<html>
	<head>
		<script src="lib/jquery-1.4.4.min.js" type="text/javascript" charset="utf-8"></script>
		<script src="lib/underscore-min.js" type="text/javascript" charset="utf-8"></script>
		<script src="build/log.js" type="text/javascript" charset="utf-8"></script>
		<script src="build/daemon.js" type="text/javascript" charset="utf-8"></script>
		<script src="build/providers/jsonpFeedProvider.js" type="text/javascript" charset="utf-8"></script>
		<script src="build/handlers/listView.js" type="text/javascript" charset="utf-8"></script>
		<script src="build/handlers/simpleView.js" type="text/javascript" charset="utf-8"></script>
		<script src="build/handlers/playMusic.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		<script type="text/javascript" charset="utf-8">
			newDaemon()
			.start({
				name : 'Example Project',
				filter: {include: [/job1/], exclude: [/pipeline2/]},
				interval: 30,
				feedProvider: jsonpFeedProvider({
									url: 'http://www.foo.com/cruise/cctray.xml', 
									proxy:'http://localhost:12512'
									}),
				handlers: [
							tableView(),
						   	playMusic({	
								successful:{
									url:['http://site/success.mp3', 'http://site/success.ogg'],
									start: 120,
									stop: 130
								},
				   				fixed:{
									url:'http://site/fixed.mp3',
									start : 120
								},
								failedAgain:{
									url:'http://site/failedAgain.mp3'
								},
				   				failed:{
									url:'http://site/failure.mp3',
									start : 120,
									stop: 130
								}
								})
						 ]
			});
		</script>
	</body>
	</html>

build_monitor use jsonp to get the feed from CI server, so you need two urls, one for the feed and the other for the proxy. Also you need to tell daemon how often to retrieve the feed via *interval*. In the example, we use two *handlers*. One is *tableView* which will show the status of each project in the feed. The other is *playMusic*, so when the build success or failed, build_monitor will play sound to notify you. Current modern browsers supports different format of sound. For example, Firefox can play .ogg while Chrome can play .mp3. So you can add more than one sound url to make it work in multiple browsers.