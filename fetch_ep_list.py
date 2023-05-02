from bs4 import BeautifulSoup as bs
from requests import get

class Fetch_EP:
    def __init__(self):
        self.url = self.get_main_url()

    # Get soup using URL
    # It will first GET URL and then return soup
    def get_soup(self, url):
        r = get(url)
        if r.status_code == 404:
            self.error(f"URL: {url}\n404 Not Found ...")
        content = r.content
        # open("test.html", "wb").write(content)
        # content = open("test.html").read()
        soup = bs(content, "html.parser")
        return soup

    def get_req_url(self):
        soup = self.get_soup(self.url)
        print("DONE FETCHING MAIN URL ...")

        # URL of api
        api_url = "https://ajax.gogo-load.com/ajax/load-list-episode"

        ep_page_ul = soup.find("ul", {"id": "episode_page"})
        if not ep_page_ul:
            self.error("episode_page not found in given URL")

        ep_page_a = ep_page_ul.find("a")

        ep_start = ep_page_a["ep_start"]
        ep_end = ep_page_a["ep_end"]

        anime_id = soup.find("input", {"id": "movie_id"})["value"]
        default_ep = soup.find("input", {"id": "default_ep"})["value"]
        alias = soup.find("input", {"id": "alias_anime"})["value"]

        req_url = f"{api_url}&ep_start={ep_start}&ep_end={ep_end}&id={anime_id}&default_ep={default_ep}&alias={alias}"
        return req_url

    def get_main_url(self):
        file = open("link.txt")
        data = file.read()
        url = data.split("\n")[0]
        return url

    def get_ep_list(self):
        URL = self.get_req_url()
        print(f"API: {URL}")
        soup = self.get_soup(URL)
        print("DONE FETCHING API")
        a_links = soup.find_all("a")
        links = []
        for a in a_links:
            links.append(a["href"])
        return links
       
    def error(self, msg):
        print(msg)
        input("Press ENTER to exit ...")
        exit()


