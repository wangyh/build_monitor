var PORT = 7777;

var http = require('http');
http.createServer(function (request, response){
	var queryString = require('url').parse(request.url, true).query;
	var callback = queryString.callback;
	var contentType = queryString.contentType;
	console.log(str('new requst for {0}, callback: {1}, contentType: {2}', queryString.url, callback, contentType))
	getJson(queryString.url, function(statuscode,headers, body){
		response.writeHead(statuscode, headers);
		if(contentType === 'xml'){
			response.end( (callback || "foo") + '(\'' + body + '\')');
		}
		else {
			response.end( (callback|| "foo") + '(' + body + ')');
		}
	});
}).listen(PORT);

function str(format){
	var result = format;
	for(var i=0; i< arguments.length -1 ; i++){
		result = result.replace('{' + i + '}', arguments[i + 1]);
	}
	return result;
}
function getJson(url, callback){
	var target = require('url').parse(url);
	var config = {
		host: target.hostname,
		port : target.post || 80,
		path: target.pathname
	};
	var client = http.createClient(config.port, config.host);
	console.log(str('requesting {0}...', url));
	console.log(str('hostname: {0}, port: {1}' ,config.host, config.port));
	
	var request = client.request('GET', config.path, {'host': config.host});
	request.end();
	request.on('response', function(response){
		console.log(str('get response for {0}...', url));
		console.log(str('status: {0}', response.statusCode));
		console.log(str('headers: {0}', JSON.stringify(response.headers)));
		
		response.on('data', function(chunk){
			callback(response.statusCode, response.headers, chunk);
		})	
	})
}
console.log(str('Server running on port {0}......' ,PORT));