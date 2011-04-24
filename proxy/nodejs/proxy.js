var http = require('http');
var url = require('url');
var PORT = process.argv[2] || 12512;

function getParameters(request){
	var queryString = url.parse(request.url, true).query;
	return {
		url: queryString.url,
		callback : queryString.callback || "foo",
		username: queryString.username,
		password: queryString.password
	}
}
function getJson(uri, callback){
	var target = url.parse(uri);
	var config = {
		host: target.hostname,
		port : target.port || 80,
		path: target.pathname,
		auth: target.auth
	};
	var client = http.createClient(config.port, config.host);
	client.on('error', function(err) {
	        log.error("{0} -- {1}", uri, err);
	    });
	
	log.info('requesting {0}...', uri);
	log.info(JSON.stringify(config));
	var header = {'host': config.host};
	if(config.auth){
		header["Authorization"] = "Basic " + new Buffer(config.auth).toString('base64');
		log.info('header:{0}' , JSON.stringify(header));
	}
	var request = client.request('GET', config.path, header);
	request.on('response', function(response){
		log.info('get response for {0}...', uri);
		log.info('status: {0}', response.statusCode);
		log.info('headers: {0}', JSON.stringify(response.headers));
		var data = '';
		response.on('data', function(chunk){
			data += chunk;
		});
		response.on('end', function(){
			callback(response.statusCode, response.headers, data);
		})	
	});
	request.end();
}
http.createServer(function (request, response){
	var params = getParameters(request);
	log.info('----------------------------------------------');
	log.info('new request for {0}, callback: {1}', params.url, params.callback);
	getJson(params.url, function(statuscode,headers, body){
		var responseBody = str("{0}({1})", params.callback, JSON.stringify(require('./lib/xml2json').xml2json.parser(body)));
		headers["Content-Length"] = responseBody.length;
		headers["Content-type"] = 'application/javascript'
		
		log.info('send back: {0} \n{1}', JSON.stringify(headers), responseBody);
		
		response.writeHead(statuscode, headers);
		response.end(responseBody);
	});
}).listen(PORT);
var  log = function(){
	function error(){
		console.error(str.apply(null, arguments));
	}
	function info(){
		console.info(str.apply(null, arguments));
	}
	return {
		error: error,
		info : info
	};
}();
function str(format){
	var result = format;
	for(var i=0; i< arguments.length -1 ; i++){
		result = result.replace('{' + i + '}', arguments[i + 1]);
	}
	return result;
}
log.info('Server running on port {0}......' ,PORT);
