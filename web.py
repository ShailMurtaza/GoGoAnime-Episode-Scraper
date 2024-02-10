#!/usr/bin/python3
from flask import Flask, request, render_template, abort, redirect
from database import Database, Anime, Episode
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
    anime = database.anime_all() # List of all anime
    anime = anime_to_dict(anime)
    return render_template("anime.html", anime=anime)


# get specific anime with its episode list
@app.route("/get_anime/<int:ID>")
def get_anime(ID):
    anime = database.get_anime(ID)
    if anime:
        ep_list = database.anime_ep_list(ID)
        ep_list = ep_to_dict(ep_list)
        return render_template("ep_list.html", anime_id=ID, ep_list=ep_list)
    return redirect("/")


# get index of specific anime using primary key
@app.route("/get_index/<int:ID>")
def get_anime_index(ID):
    anime = database.get_anime(ID)
    if anime:
        return str(anime.index)
    return "False"


# update/set index of anime
@app.route("/set_index/<int:ID>/<int:index>")
def set_anime_index(ID, index):
    anime = database.get_anime(ID)
    if anime:
        ep_num = database.episodes_count(ID)
        # Number of episodes should be greater than index being set because index starts with 0
        if ep_num >= 0 and ep_num > index:
            anime.index = index
            database.update_anime(anime)
            return "True"
    return "False"


@app.route("/scrap")
def scrap():
    return render_template("scrap.html")


@app.route("/update_anime/<int:ID>")
def update_anime(ID):
    anime = database.get_anime(ID)
    if not anime:
        return redirect("/")
    return render_template("scrap.html", anime_id=anime.id, anime_url=anime.anime_url, update=True)


# Return number of episodes of anime
@app.route("/anime_count/<int:ID>")
def anime_count(ID):
    anime = database.get_anime(ID)
    if not anime:
        return "False"
    count = database.episodes_count(ID)
    return str(count)


# save new anime, or update list of episode if anime already exist
@app.route("/save_anime", methods=["POST"])
def save_anime():
    anime_dict = request.get_json()
    anime_id = anime_dict.get("anime_id")
    anime_url = anime_dict.get("anime_url")
    if not anime_id:
        title = anime_dict.get("title").replace("-", " ")
        anime = Anime((None, title, anime_url, None, 0))
        anime = database.insert_anime(anime)
    else:
        anime = database.get_anime(anime_id)
        if not anime:
            return "No Anime Found to update"
        anime.anime_url = anime_url

    ep_list = anime_dict.get("ep_list")
    for i in ep_list:
        ep_title = i[0]
        ep_url = i[1]
        episode = Episode((None, anime.id, ep_title, ep_url))
        database.insert_episode(episode)
    database.commit()
    return "True"


# Delete anime with its episodes
@app.route("/del_anime/<int:ID>")
def del_anime(ID):
    anime = database.get_anime(ID)
    if anime:
        database.delete_anime(ID)
    return redirect("/")


# Update title of anime
@app.route("/edit_title/<int:ID>", methods=["POST"])
def edit_title(ID):
    title = request.get_json().get("title")
    anime = database.get_anime(ID)
    if anime and title:
        anime.title = title
        database.update_anime(anime)
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


if __name__ == "__main__":
    HOST = "0.0.0.0"
    PORT = 5050
    print("+-------------------------------+")
    print(f"URL: http://localhost:{PORT}")
    print("+-------------------------------+")
    app.run(host=HOST, port=PORT, debug=True)

