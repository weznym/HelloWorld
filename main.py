from datetime import datetime


def hello_world():
    return "hello world"


def greeting(name="Wesley"):
    hour = datetime.now().hour
    if hour < 12:
        salutation = "Good Morning"
    elif hour < 18:
        salutation = "Good Afternoon"
    else:
        salutation = "Good Evening"
    return f"{salutation} {name}"


if __name__ == "__main__":
    print(hello_world())
    print(greeting())
