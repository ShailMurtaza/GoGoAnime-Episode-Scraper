from requests_html import HTMLSession
session = HTMLSession()
URL = "https://www3.gogoanimes.fi/category/monster-dub"

# URL of main page
URL = open("link.txt").read().split("\n")[0]
print(f"URL: {URL}...")

r = session.get(URL)

r.html.render(timeout=20)
open("ANIME.html", "wb").write(r.html.raw_html)
input("SAVED in ANIME.html\nPress ENTER to close ...")

