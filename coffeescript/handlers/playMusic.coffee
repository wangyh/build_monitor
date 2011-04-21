createAudioElement = (url) ->
	audio = document.createElement('audio')
	sources = if _.isArray(url) then url else [url]
	getAudioType = (ele) ->
		if /.mp3$/.test(ele)
			'audio/mpeg'
		else if /.ogg$/.test(ele)
			'audio/ogg'
		else
			''
			
	_.each(sources, (ele) ->
			$('<source>')
			.attr('src', ele)
			.attr('type', getAudioType(ele) )
			.appendTo($(audio)))
	$(audio).appendTo($('body'))
	
waitForCondition = (condition, callback) ->
	setTimeout(() -> if condition() then callback() else waitForCondition(condition, callback),
	1000)
	
play = (url, start, stop) ->
	$('audio').remove()
	audio = createAudioElement(url)
	startTime = start or 0
	endTime = stop
	
	audioLoaded = () -> audio.duration
	audioEnd = () -> audio.currentTime >= Math.min(endTime, audio.duration)
	pauseAudio = () -> audio.pause()
	playAudio = () ->
		audio.currentTime = startTime
		audio.play()
		if endTime
			waitForCondition(audioEnd, pauseAudio)
			
	waitForCondition(audioLoaded, playAudio)

playAudio = (audio) ->
	play(audio.url, audio.start, audio.stop)
	
@playMusic = (config) ->
	return (data) ->
		projects = data.changedProjects
		if projects.failed.length and config.failed
			playAudio(config.failed)
		else if projects.failedAgain.length and config.failedAgain
			playAudio(config.failedAgain)
		else if projects.successful.length and config.successful
			playAudio(config.successful)
		else if projects.fixed.length and config.fixed
			playAudio(config.fixed)