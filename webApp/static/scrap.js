const url_inp = document.getElementById("url_inp")
const output_cont = document.getElementById("output")
const scrap_btn = document.getElementById("scrap_btn")
const api_url = "https://ajax.gogo-load.com/ajax/load-list-episode" // API of GoGo Anime from where we can fetch ul list of all animes
const parser = new DOMParser();


async function scrap() {
    scrap_btn.disabled = true // disable scrap button
    let anime_url = url_inp.value // get url from input box
    if (anime_url) { // if input box is not empty
        anime_url = btoa(anime_url) // encode url to base 64
        output("FETCHING ...")
        let html = await fetch_data("/fetch/" + anime_url) // get HTML data of url using fetch api of server
        output("FETCHED ...")
        anime_url = gen_url(html) // generate full GoGo Anime URL to fetch links of all episodes
        output("URL has been generated ...")
        console.log(anime_url)
    }
    else {
        console.error("Enter URL")
        scrap_btn.disabled = false
    }
}


function gen_url(data) {
    let htmlDoc = parser.parseFromString(data, "text/html") // Parse HTML
    // get all parameters to generate URL of GoGo Anime API
    let episode_page = htmlDoc.getElementById("episode_page")
    let a_href = episode_page.getElementsByTagName("a")

    let ep_start = a_href[0].getAttribute("ep_start")
    let ep_end = a_href[a_href.length - 1].getAttribute("ep_end")
    let anime_id = htmlDoc.getElementById("movie_id").value
    let default_ep = htmlDoc.getElementById("default_ep").value
    let alias = htmlDoc.getElementById("alias_anime").value

    let url = `${api_url}?ep_start=${ep_start}&ep_end=${ep_end}&id=${anime_id}&default_ep=${default_ep}&alias=${alias}`
    return url
}


async function fetch_data(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}


function output(text) {
    output_cont.innerHTML += text = "\n"
}
