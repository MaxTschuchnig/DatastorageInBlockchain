from http.server import BaseHTTPRequestHandler, HTTPServer
import re, json

clients = []

def get_content_length(header):
    m = re.search('Content-Length: (\w+)', str(header))
    return m.group(1)


def add_client_to_list(newClient):
    global clients
    clients.append(newClient)
    clients = cleanupClients()

def cleanupClients():
    cleanedUpClients = []
    for client in clients:
        if client not in cleanedUpClients:
            cleanedUpClients.append(client)
    return cleanedUpClients


# HTTPRequestHandler class
class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    # GET
    def do_GET(self):
        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'text/html')
        self.end_headers()

        # Send message back to client
        message = ''.join(clients)

        # Write content as utf-8 data
        self.wfile.write(bytes(message, "utf8"))
        return

    # POST
    def do_POST(self):
        len = int(get_content_length(str(self.headers)))
        add_client_to_list(str(self.rfile.read(len)))

        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'text/html')
        self.end_headers()

        # Send message back to client
        # message = str(self.rfile.read(len))
        message = 'HI POST'

        # Write content as utf-8 data
        self.wfile.write(bytes(message, "utf8"))

        return

def run():
    print('starting server...')

    # Server settings
    # Choose port 8080, for port 80, which is normally used for a http server, you need root access
    server_address = ('0.0.0.0', 8000)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('running server...')
    httpd.serve_forever()


run()