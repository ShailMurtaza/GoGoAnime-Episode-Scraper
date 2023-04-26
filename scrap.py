from bs4 import BeautifulSoup as bs 
import requests

def get_soup(url):
    resp = requests.get(url)
    soup = bs(resp.content, "html.parser")
    return soup

URL = "https://www3.gogoanimes.fi/category/monster-dub"

soup = get_soup(URL)

