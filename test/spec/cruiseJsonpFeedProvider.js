describe("cruiseJsonpFeedProvider", function(){
	it("should request correct url",function(){
		var mock = {
			ajax : function(config){
				mock.url = config.url;
			}
		}
		var provider = createCruiseJsonpFeedProvider(mock)({url: 'http://foo.com', proxy:'http://proxy'});
		provider(function(){});
		expect(mock.url).toEqual('http://proxy?url=http://foo.com');
	});
});
