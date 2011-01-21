var PORT = 7777;

var http = require('http');

http.createServer(function (request, response){
	response.writeHead(200, {});
	response.end('hello');
}).listen(8080);

http.createServer(function (request, response){
	var params = getParameters(request);
	log(str('new requst for {0}, callback: {1}, contentType: {2}', params.url, params.callback, params.contentType))
	getJson(params.url, function(statuscode,headers, body){
		response.writeHead(statuscode, headers);
		var responseBody = params.contentType === 'xml' ?
			str("{0}('{1}')", params.callback, body) :
			str("{0}({1})", params.callback, body);
		response.end(responseBody);
	});
}).listen(PORT);
function getParameters(request){
	var queryString = require('url').parse(request.url, true).query;
	return {
		url: queryString.url,
		callback : queryString.callback || "foo",
		contentType: queryString.contentType || "json"
	}
}
function getJson(url, callback){
	var target = require('url').parse(url);
	var config = {
		host: target.hostname,
		port : target.port || 80,
		path: target.pathname
	};
	var client = http.createClient(config.port, config.host);
	log(str('requesting {0}...', url));
	log(str('hostname: {0}, port: {1}' ,config.host, config.port));
	
	var request = client.request('GET', config.path, {'host': config.host});
	request.end();
	request.on('response', function(response){
		log(str('get response for {0}...', url));
		log(str('status: {0}', response.statusCode));
		log(str('headers: {0}', JSON.stringify(response.headers)));
		
		response.on('data', function(chunk){
			callback(response.statusCode, response.headers, chunk);
		})	
	})
}

function log(){
	console.log(str.apply(null, arguments));
}
function str(format){
	var result = format;
	for(var i=0; i< arguments.length -1 ; i++){
		result = result.replace('{' + i + '}', arguments[i + 1]);
	}
	return result;
}
log(str('Server running on port {0}......' ,PORT));