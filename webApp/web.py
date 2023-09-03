from flask import Flask, render_template, abort
from requests import get
from base64 import b64decode
import logging
from time import sleep

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
app = Flask(__name__)


def get_links():
    data = open("download_links.txt").read()
    data = data.split("\n")[:-1]
    matrix = []
    for i in data:
        row = i.split(", ")
        matrix.append(row)
    return matrix


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/scrap")
def scrap():
    return render_template("scrap.html")


@app.route("/fetch/<url>")
def fetch(url):
    url = b64decode(url).decode()
    # r = get(url)
    # if r.status_code == 404:
        # return abort(404)
    # return r.content
    return open("test.html", "r").read()


@app.route("/test/fetch/<url>")
def fetch_list(url):
    return open("test_list.html", "r").read()


@app.route("/get")
def get_links():
    matrix = get_links()
    return str(matrix).replace("'", '"')


app.run(host="0.0.0.0", port=8080, debug=True)

