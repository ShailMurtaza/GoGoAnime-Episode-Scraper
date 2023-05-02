from fetch_ep_list import Fetch_EP

# URL of main page
URL = open("link.txt").read().split("\n")[0]
print(f"URL: {URL}")

# Take URL and end link and then join them
def get_url(URL, link):
    URL = URL.split("/")[2]
    link = link.strip()
    full_link = "https://" + URL + link
    return full_link


# List in which all title an links will be stored
ep_download_links = []

fetch = Fetch_EP()
links = fetch.get_ep_list()

#Iterate over every link
for link in links:
    url = get_url(URL, link)
    # get soup of currect episode
    soup_ep = fetch.get_soup(url)
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
