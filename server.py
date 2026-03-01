"""Local dev server with clean URL support (no .html extensions needed)."""
import http.server
import os

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Strip query string for file lookup
        path = self.path.split('?')[0]

        # If path doesn't have extension and isn't a directory, try .html
        if '.' not in os.path.basename(path) and not path.endswith('/'):
            html_path = os.path.join(os.getcwd(), path.lstrip('/') + '.html')
            if os.path.isfile(html_path):
                self.path = path + '.html'

        super().do_GET()

if __name__ == '__main__':
    PORT = 8000
    with http.server.HTTPServer(('', PORT), CleanURLHandler) as httpd:
        print(f'Dev server running at http://localhost:{PORT}')
        httpd.serve_forever()
