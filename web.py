#!/usr/bin/python3
from flask import Flask, request, render_template, abort
from flask_sqlalchemy import SQLAlchemy
from requests import get
from base64 import b64decode
import logging


log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
app.app_context().push()


class Anime(db.Model):
    __tablename__ = "Anime"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    path = db.Column(db.Text, nullable=True)
    index = db.Column(db.Integer, default=0)

class EP_list(db.Model):
    __tablename__ = "EP_list"
    id = db.Column(db.Integer, primary_key=True)
    anime_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.Text, nullable=False)
    url = db.Column(db.Text, nullable=False)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/scrap")
def scrap():
    return render_template("scrap.html")


@app.route("/save_anime", methods=["POST"])
def save_anime():
    anime_dict = request.get_json()
    anime = Anime(title=anime_dict.get("title"))
    db.session.add(anime)
    db.session.commit()

    ep_list = anime_dict.get("ep_list")
    for i in ep_list:
        ep_title = i[0]
        ep_url = i[1]
        episode = EP_list(anime_id=anime.id, title=ep_title, url=ep_url)
        db.session.add(episode)
    db.session.commit()
    
    return "True"


@app.route("/fetch/<url>")
def fetch(url):
    url = b64decode(url).decode()
    r = get(url)
    if r.status_code == 404:
        return abort(404)
    return r.content


@app.route("/main_url/fetch")
def fetch_main_url():
    return open("test.html", "r").read()

@app.route("/url_list/fetch")
def fetch_list():
    return open("test_list.html", "r").read()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)

