from bs4 import BeautifulSoup as bs
from requests import get


def get_soup(url):
    print(f"URL: {url}")
    r = get(url)
    content = r.content
    open("test.html", "wb").write(content)
    # content = open("test.html").read()
    soup = bs(content, "html.parser")
    return soup


def get_req_url():
	URL = open("link.txt").read().split("\n")[0]
	soup = get_soup(URL)

	# URL of api
	api_url = "https://ajax.gogo-load.com/ajax/load-list-episode"

	ep_page_a = soup.find("ul", {"id": "episode_page"}).find("a")
	ep_start = ep_page_a["ep_start"]
	ep_end = ep_page_a["ep_end"]

	anime_id = soup.find("input", {"id": "movie_id"})["value"]
	default_ep = soup.find("input", {"id": "default_ep"})["value"]
	alias = soup.find("input", {"id": "alias_anime"})["value"]

	req_url = f"{api_url}?ep_start={ep_start}?ep_end={ep_end}?id={anime_id}?default_ep={default_ep}?alias={alias}"
	return req_url


req_url = get_req_url()
print(req_url)

