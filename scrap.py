from fetch_ep_list import Fetch_EP

fetch = Fetch_EP()

# URL of main page
URL = fetch.url
print(f"MAIN URL: {URL}")

links = fetch.get_ep_list()
# Take URL and end link and then join them
def get_url(URL, link):
    URL = URL.split("/")[2]
    link = link.strip()
    full_link = "https://" + URL + link
    # print(full_link)
    return full_link


# List in which all title an links will be stored
ep_download_links = []

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
