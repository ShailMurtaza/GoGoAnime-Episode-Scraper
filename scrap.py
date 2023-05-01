from bs4 import BeautifulSoup as bs 
import requests

# Get soup using HTML content
def get_soup_content(html):
    content = open(html).read()
    soup = bs(content, "html.parser")
    return soup


# Get soup using URL
# It will first GET URL and then return soup
def get_soup(url):
    r = requests.get(url)
    content = r.content
    soup = bs(content, "html.parser")
    return soup

# URL of main page
URL = open("link.txt").read().split("\n")[0]
print(f"URL: {URL}")

# Open ANIME.html file where rendered data is stored of main page
soup = get_soup_content("ANIME.html")

# Take URL and end link and then join them
def get_url(URL, link):
    URL = URL.split("/")[2]
    link = link.strip()
    full_link = "https://" + URL + link
    return full_link

# Get ul of all episodes
ul = soup.find("ul", {"id": "episode_related"})

# List in which all title an links will be stored
ep_download_links = []

#Iterate over every li in ul
for li in ul.children:
    link = li.find("a")["href"]
    url = get_url(URL, link)
    # get soup of currect episode
    soup_ep = get_soup(url)
    title = soup_ep.find("div", {"class", "anime_video_body"}).find("h1").text
    print(title)
    
    # Fetch link to download
    link_li = soup_ep.find("li", {"class", "dowloads"})
    link = link_li.find("a")["href"]

    ep_download_links.append((title, link))

file = open("download_links.txt", "w")

for title, link in ep_download_links:
    row = f"{title}, {link}\n"
    # print(row)
    file.write(row)

file.close()

input("DONE ...\nCopy download_links.txt in webApp directory\nPress ENTER to close ...\n")
