from datetime import datetime
import json
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

DEFAULT_NAME = "Welly"
DEFAULT_CITY = "Dallas"


def hello_world():
    return "hello world"


def greeting(name=DEFAULT_NAME):
    hour = datetime.now().hour
    if hour < 12:
        salutation = "Good Morning"
    elif hour < 18:
        salutation = "Good Afternoon"
    else:
        salutation = "Good Evening"
    return f"{salutation} {name}"


def get_weather(city=DEFAULT_CITY):
    """Fetch current weather for `city` from wttr.in and return a short string.

    Uses no API key. Returns 'temp°F, description' or an error message.
    """
    url = f"https://wttr.in/{urllib.parse.quote(city)}?format=j1"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.load(resp)
        current = data.get("current_condition", [{}])[0]
        temp_f = current.get("temp_F", "N/A")
        desc = ""
        if current.get("weatherDesc"):
            desc = current["weatherDesc"][0].get("value", "")
        return f"{temp_f}°F, {desc}"
    except Exception as e:
        return f"unavailable ({e})"


class WeatherApiHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)

        if parsed.path == "/api/greeting":
            name = params.get("name", [DEFAULT_NAME])[0].strip() or DEFAULT_NAME
            self.send_json({"greeting": greeting(name), "name": name}, 200)
            return

        if parsed.path == "/api/weather":
            city = params.get("city", [DEFAULT_CITY])[0].strip() or DEFAULT_CITY
            self.send_json({"city": city, "weather": get_weather(city)}, 200)
            return

        if parsed.path == "/":
            self.send_json({"message": hello_world()}, 200)
            return

        self.send_json({"error": "not found"}, 404)

    def send_json(self, payload, status_code):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args, **kwargs):
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), WeatherApiHandler)
    print("Serving on http://127.0.0.1:8000")
    server.serve_forever()
