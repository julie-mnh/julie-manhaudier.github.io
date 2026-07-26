import http.server, socketserver, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args): pass

# Threaded so large media (autoplay videos) don't block other requests.
class Server(socketserver.ThreadingTCPServer):
    daemon_threads = True
    allow_reuse_address = True

with Server(("", 3333), Handler) as httpd:
    httpd.serve_forever()
