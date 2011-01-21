var PORT = 7777;
var LOG_LEVEL = 'ERROR';
var http = require('http');
http.createServer(function (request, response){
	var params = getParameters(request);
	log.info('----------------------------------------------');
	log.info('new requst for {0}, callback: {1}, contentType: {2}', params.url, params.callback, params.contentType);
	getJson(params.url, function(statuscode,headers, body){
		var responseBody = str("{0}({1})", params.callback, params.contentType === 'xml' ? JSON.stringify(require('./lib/xml2json').xml2json.parser(body)) : body);
		headers["Content-Length"] = responseBody.length;
		log.info('send back: {0} \n{1}', JSON.stringify(headers), responseBody);
		
		response.writeHead(statuscode, headers);
		response.end(responseBody);
	});
}).listen(PORT);
function getParameters(request){
	var queryString = require('url').parse(request.url, true).query;
	return {
		url: queryString.url,
		callback : queryString.callback || "foo",
		contentType: queryString.contentType || "json",
		username: queryString.username,
		password: queryString.password
	}
}
function getJson(url, callback){
	var target = require('url').parse(url);
	var config = {
		host: target.hostname,
		port : target.port || 80,
		path: target.pathname,
		auth: target.auth
	};
	var client = http.createClient(config.port, config.host);
	client.on('error', function(err) {
	        log.error("{0} -- {1}", url, err);
	    });
	
	log.info('requesting {0}...', url);
	log.info(JSON.stringify(config));
	var header = {'host': config.host};
	if(config.auth){
		header["Authorization"] = "Basic " + new Buffer(config.auth).toString('base64');
		log.info('header:{0}' , JSON.stringify(header));
	}
	var request = client.request('GET', config.path, header);
	request.on('response', function(response){
		log.info('get response for {0}...', url);
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
var  log = function(){
	function error(){
		log.apply(null, arguments);
	}
	function info(){
		if(LOG_LEVEL !== 'ERROR'){
			log.apply(null, arguments);
		}
	}

	function log(){
		console.log(str('{0}: {1}',new Date().toTimeString(),str.apply(null, arguments)));
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