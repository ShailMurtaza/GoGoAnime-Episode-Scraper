#!/usr/bin/python3
from flask import Flask, request, render_template, abort, redirect
from database import Database
import requests
from base64 import b64decode
import logging
from to_dict import anime_to_dict, ep_to_dict


log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
app = Flask(__name__)
app.config["database"] = "instance/database.db"
database = Database(app.config.get("database"))



@app.route("/")
def index():
    anime = database.anime_all()
    anime = anime_to_dict(anime)
    return render_template("anime.html", anime=anime)

@app.route("/get_anime/<int:ID>")
def get_anime(ID):
    anime = database.is_anime(ID)
    if anime:
        ep_list = database.anime_ep_list(ID)
        ep_list = ep_to_dict(ep_list)
        return render_template("ep_list.html", anime_id=ID, ep_list=ep_list)
    return redirect("/")


@app.route("/get_index/<int:ID>")
def get_anime_index(ID):
    anime = database.is_anime(ID)
    if anime:
        return str(anime.index)
    return "False"


@app.route("/set_index/<int:ID>/<int:index>")
def set_anime_index(ID, index):
    anime = database.is_anime(ID)
    if anime:
        ep_num = database.ep_list_count(ID)
        if ep_num >= 0 and ep_num > index:
            database.set_anime_index(ID, index)
            return "True"
    return "False"


"""
@app.route("/scrap")
def scrap():
    return render_template("scrap.html")


@app.route("/update_anime/<int:ID>")
def update_anime(ID):
    anime = db.session.get(Anime, ID)
    if not anime:
        return redirect("/")
    return render_template("scrap.html", anime_id=anime.id, anime_url=anime.anime_url, update=True)


@app.route("/anime_count/<int:ID>")
def anime_count(ID):
    anime = db.session.get(Anime, ID)
    if not anime:
        return "False"
    count = EP_list.query.filter_by(anime_id=ID).count()
    return str(count)


@app.route("/save_anime", methods=["POST"])
def save_anime():
    anime_dict = request.get_json()
    anime_id = anime_dict.get("anime_id")
    anime_url = anime_dict.get("anime_url")
    if not anime_id:
        title = anime_dict.get("title").replace("-", " ").title()
        anime = Anime(title=title, anime_url=anime_url)
        db.session.add(anime)
        db.session.commit()
    else:
        anime = db.session.get(Anime, anime_id)
        if not anime:
            return "No Anime Found to update"
        anime.anime_url = anime_url

    ep_list = anime_dict.get("ep_list")
    for i in ep_list:
        ep_title = i[0]
        ep_url = i[1]
        episode = EP_list(anime_id=anime.id, title=ep_title, url=ep_url)
        db.session.add(episode)
    db.session.commit()
    
    return "True"


@app.route("/del_anime/<int:ID>")
def del_anime(ID):
    anime = db.session.get(Anime, ID)
    if anime:
        ep_list = EP_list.query.filter_by(anime_id=ID)
        db.session.delete(anime)
        for i in ep_list:
            db.session.delete(i)
        db.session.commit()
    return redirect("/")


@app.route("/edit_title/<int:ID>", methods=["POST"])
def edit_title(ID):
    title = request.get_json().get("title")
    anime = db.session.get(Anime, ID)
    if anime and title:
        anime.title = title.title()
        db.session.commit()
        return str(anime.title)
    return "False"


@app.route("/fetch/<url>")
def fetch(url):
    try:
        url = b64decode(url).decode()
        r = requests.get(url)
        if r.status_code == 404:
            return abort(404)
        return r.content
    except Exception as err:
        print(err)
        return "False"
"""

if __name__ == "__main__":
    HOST = "0.0.0.0"
    PORT = 5050
    print("+-------------------------------+")
    print(f"URL: http://localhost:{PORT}")
    print("+-------------------------------+")
    app.run(host=HOST, port=PORT, debug=True)

