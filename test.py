from requests_html import HTMLSession
session = HTMLSession()

r = session.get("https://www3.gogoanimes.fi/category/monster-dub")

r.html.render()
open("ANIME.html", "wb").write(r.content)
