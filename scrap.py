from bs4 import BeautifulSoup as bs 
import requests


def get_soup_content(html):
    content = open(html).read()
    soup = bs(content, "html.parser")
    return soup


def get_soup(url):
    r = requests.get(url)
    content = r.content
    soup = bs(content, "html.parser")
    return soup


URL = "https://www3.gogoanimes.fi/category/monster-dub"

soup = get_soup_content("ANIME.html")

def get_url(URL, link):
    URL = URL.split("/")[2]
    link = link.strip()
    full_link = "https://" + URL + link
    return full_link

ul = soup.find("ul", {"id": "episode_related"})
for li in ul.children:
    link = li.find("a")["href"]
    url = get_url(URL, link)
    print(url)
    get_soup(url)
    break

