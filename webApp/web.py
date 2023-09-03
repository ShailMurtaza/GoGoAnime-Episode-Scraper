from flask import Flask, render_template

app = Flask(__name__)
app.secret_key = "KEY"


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


@app.route("/get")
def get():
    matrix = get_links()
    return str(matrix).replace("'", '"')


app.run(host="0.0.0.0", port=8080, debug=True)

