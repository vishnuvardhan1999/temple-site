import json, urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

UPSTREAM = "https://www.watfordvelmurugan.org/api/land-appeal-progress"

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split("?")[0] == "/api/land-appeal-progress":
            try:
                with urllib.request.urlopen(UPSTREAM, timeout=8) as r:
                    body = r.read()
            except Exception:
                body = json.dumps({"success": False}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            return
        return super().do_GET()

if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 4173), Handler).serve_forever()
