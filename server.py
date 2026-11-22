"""
4-Bit Arithmetic Circuit Simulator - High-Performance Web Server & Project Runner
Multi-threaded, Dual-Stack (IPv4 & IPv6), Non-Blocking Server for Chrome & Modern Browsers.
"""

import sys
import os
import socket
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
import test_circuit
import main as cli_main

DEFAULT_PORT = 8000
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

FAVICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#070B14"/>
  <text x="50" y="65" font-size="50" text-anchor="middle" fill="#00F0FF" font-family="monospace" font-weight="bold">4b</text>
</svg>""".encode("utf-8")


class CircuitHTTPRequestHandler(SimpleHTTPRequestHandler):
    """Robust HTTP Request Handler with proper MIME types, caching headers, and favicon support."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PROJECT_DIR, **kwargs)

    def do_GET(self):
        # Serve favicon immediately to prevent 404 retries or connection hangs
        if self.path in ('/favicon.ico', '/favicon.svg'):
            self.send_response(200)
            self.send_header('Content-Type', 'image/svg+xml')
            self.send_header('Content-Length', str(len(FAVICON_SVG)))
            self.send_header('Cache-Control', 'public, max-age=86400')
            self.end_headers()
            self.wfile.write(FAVICON_SVG)
            return

        # Redirect root to index.html if needed or let SimpleHTTPRequestHandler handle it
        return super().do_GET()

    def end_headers(self):
        # Ensure fresh development responses without stale browser caching
        if not self.path.startswith('/favicon'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Clean formatted server output
        sys.stdout.write(f"[{self.log_date_time_string()}] {self.address_string()} - {format % args}\n")
        sys.stdout.flush()


class DualStackThreadingServer(ThreadingHTTPServer):
    """
    Multi-threaded HTTP Server supporting both IPv4 (127.0.0.1) and IPv6 (::1).
    Handles multiple concurrent connections from Chrome and VS Code without blocking.
    """
    daemon_threads = True
    allow_reuse_address = True

    def __init__(self, server_address, RequestHandlerClass):
        # Enable IPv6 dual-stack if available
        try:
            self.address_family = socket.AF_INET6
            super().__init__(server_address, RequestHandlerClass)
        except Exception:
            # Fallback to standard IPv4 if IPv6 dual-stack is unsupported
            self.address_family = socket.AF_INET
            ipv4_addr = ('0.0.0.0', server_address[1])
            super().__init__(ipv4_addr, RequestHandlerClass)

    def server_bind(self):
        if self.address_family == socket.AF_INET6:
            try:
                # IPV6_V6ONLY = 0 enables dual-stack to accept both IPv4 and IPv6 on the same port
                self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
            except (AttributeError, socket.error):
                pass
        super().server_bind()


def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0


def run_server(port=DEFAULT_PORT, open_browser=True):
    os.chdir(PROJECT_DIR)

    if is_port_in_use(port):
        print(f"[!] Warning: Port {port} is already in use.")
        print(f"[!] Attempting to bind or use next available port...")
        for p in range(port, port + 10):
            if not is_port_in_use(p):
                port = p
                break

    bind_addr = ('::', port)
    
    print("=" * 65)
    print("       4-BIT ARITHMETIC CIRCUIT SIMULATOR - WEB SERVER")
    print("=" * 65)
    print(f"[*] Serving project directory: {PROJECT_DIR}")
    print(f"[*] Multi-threaded Dual-Stack HTTP server started.")
    print(f"[*] Local URL (IPv4):     http://127.0.0.1:{port}/")
    print(f"[*] Local URL (Hostname): http://localhost:{port}/")
    print(f"[*] Press Ctrl+C in terminal to stop server.")
    print("=" * 65)
    sys.stdout.flush()

    if open_browser:
        try:
            webbrowser.open(f"http://localhost:{port}/")
        except Exception as e:
            print(f"[!] Note: Could not auto-open browser: {e}")

    try:
        httpd = DualStackThreadingServer(bind_addr, CircuitHTTPRequestHandler)
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped cleanly by user.")
    except Exception as e:
        print(f"\n[!] Server error: {e}")


if __name__ == '__main__':
    args = sys.argv[1:]
    if "--test" in args:
        test_circuit.test_circuit()
    elif "--cli" in args:
        cli_main.main()
    else:
        port = DEFAULT_PORT
        for arg in args:
            if arg.isdigit():
                port = int(arg)
        # When run directly from CLI (python server.py), open the browser
        run_server(port=port, open_browser=True)
