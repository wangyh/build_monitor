function newDeamon(){
	var pullInterval = 5 * 1000;
	var feedProvider;
	var handlers = [];
	var intervalId;
	
	function poll(){
		intervalId = setInterval(run, pullInterval);
	}
	
	function run(){
		var feed = feedProvider();
		for(var i=0; i<handlers.length; i++){
			handlers[i](feed)
		}
	}
	return {
		addHandler: function(handler){
			handlers.push(handler);
			return this;
		},
		
		feedProvider: function(theFeedProvider){
			feedProvider = theFeedProvider;
			return this;
		},
		
		start :function(interval){
			if(interval){
				pullInterval = interval;
			}
			poll();
			return this;
		}, 
		
		stop: function(){
			clearInterval(intervalId);
			return this;
		}
	};
}
newDeamon()
.feedProvider(function(){return [1,2,3]})
.addHandler(function(data){console.log('handler a ' + data)})
.addHandler(function(data){console.log('handler b ' + data)})
.start(5 * 1000);