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

ep_download_links = []

for li in ul.children:
    link = li.find("a")["href"]
    url = get_url(URL, link)
    soup_ep = get_soup(url)
    title = soup_ep.find("div", {"class", "anime_video_body"}).find("h1").text
    print(title)
    
    link_li = soup_ep.find("li", {"class", "dowloads"})
    link = link_li.find("a")["href"]

    ep_download_links.append((title, link))

file = open("download_links.txt", "w")

for title, link in ep_download_links:
    row = f"{title}, {link}"
    print(row)
    file.write(row)

file.close()
