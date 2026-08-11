from datetime import datetime
import urllib.request
import urllib.parse
import json


def hello_world():
    return "hello world"


def greeting(name="Welly"):
    hour = datetime.now().hour
    if hour < 12:
        salutation = "Good Morning"
    elif hour < 18:
        salutation = "Good Afternoon"
    else:
        salutation = "Good Evening"
    return f"{salutation} {name}"


def get_weather(city="Dallas"):
    """Fetch current weather for `city` from wttr.in and return a short string.

    Uses no API key. Returns 'temp°C, description' or an error message.
    """
    url = f"https://wttr.in/{urllib.parse.quote(city)}?format=j1"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.load(resp)
        current = data.get("current_condition", [{}])[0]
        temp_c = current.get("temp_C", "N/A")
        desc = ""
        if current.get("weatherDesc"):
            desc = current["weatherDesc"][0].get("value", "")
        return f"{temp_c}°C, {desc}"
    except Exception as e:
        return f"unavailable ({e})"


if __name__ == "__main__":
    print(hello_world())
    print(greeting())
    print(f"Weather in Dallas today: {get_weather('Dallas')}")
