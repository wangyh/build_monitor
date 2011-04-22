from __future__ import unicode_literals, print_function, division
import base64
import json
import logging
import pprint
import httplib

import tornado.httpserver
import tornado.web
import tornado.options
from tornado.options import define, options

logger = logging.getLogger(__name__)

define('port', default=7777, type=int)
class ProxyHandler(tornado.web.RequestHandler):
    def post(self, *args, **kwargs):
        req = json.loads(self.request.body)
		url = ''
		callback = ''
		username = ''
		password = ''
		auth = False
        try:
            conn = httplib.HTTPConnection(url)
            headers = {}
            if auth:
                headers["Authorization"] = "Basic %s" % base64.encodestring(
                    '%s:%s' % (username, password))[:-1]

            conn.request(req['method'], req['url'], '', headers)

            response = conn.getresponse()
            self.write(json.dumps(
                    {'status': '%d %s' % (response.status, response.reason), 'header': response.getheaders(),
                     'body': response.read()}))
        except httplib.HTTPException as ex:
            self.write(str(ex))
        finally:
            conn.close()




def start_web():
    application = tornado.web.Application([(r'/', ProxyHandler),])
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
if __name__ == "__main__":
	start_web()

