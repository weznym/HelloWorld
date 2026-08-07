from datetime import datetime


def hello_world():
    return "hello world"


def greeting():
    hour = datetime.now().hour
    if hour < 12:
        return "Good Morning"
    elif hour < 18:
        return "Good Afternoon"
    else:
        return "Good Evening"


if __name__ == "__main__":
    print(hello_world())
    print(greeting())
