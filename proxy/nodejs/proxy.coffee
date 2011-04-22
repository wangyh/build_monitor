PORT = 7777
http = require 'http'
url = require 'url'
util = require 'util'

getParameters = (request) ->
	queryString = url.parse(request.url, true).query
	return {
		url: queryString.url
		callback: queryString.callback or "foo"
		username: queryString.username
		password: queryString.password
	}
	
getJson = (uri, callback) ->
	target = url.parse(uri)
	config = {
		host: target.hostname
		port: target.port or 80
		path: target.pathname
		auth: target.auth
	}
	client = http.createClient config.port, config.host
	client.on 'error', (err) ->
		util.debug "#{uri} -- #{err}"
		
	util.log "requesting #{uri}..."
	util.log JSON.stringify(config)
	
	header = {'host' : config.host}
	if config.auth
		header["Authorization"] = "Basic " + new Buffer(config.auth).toString('base64')
		util.log "header:#{JSON.stringify(header)}"
		
	request = client.request 'GET', config.path, header
	request.on 'response', (response) ->
		util.log "get response for #{uri}..."
		util.log "status: #{response.statusCode}"
		util.log "headers: #{JSON.stringify(response.headers)}"
		data = ''
		response.on 'data', (chunk) ->
			data += chunk
		response.on 'end', () ->
			callback response.statusCode, response.headers, data
	request.end()
	
server = http.createServer (request, response) ->
	params = getParameters request
	util.log '-----------------------------------------'
	util.log "new request for #{params.url}, callback: #{params.callback}"
	getJson params.url, (statuscode, headers, body) ->
		resBody = JSON.stringify require('./lib/xml2json').xml2json.parser(body)
		responseBody = "#{params.callback}(#{resBody})"
		headers["Content-Length"] = responseBody.length
		util.log "send back: #{JSON.stringify(headers)} \n#{responseBody}"
		
		response.writeHead statuscode, headers
		response.end responseBody

server.listen PORT

util.log "Server running on port #{PORT}"