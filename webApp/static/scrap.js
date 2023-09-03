const url_inp = document.getElementById("url_inp")
const output_cont = document.getElementById("output")
const scrap_btn = document.getElementById("scrap_btn")
const api_url = "https://ajax.gogo-load.com/ajax/load-list-episode" // API of GoGo Anime from where we can fetch ul list of all animes


async function scrap() {
    let anime_url = url_inp.value
    if (anime_url) {
        anime_url = btoa(anime_url)
        output("FETCHING ...")
        let html = await fetch_data("/fetch/" + anime_url)
        console.log(html)
    }
    else {
        console.error("Enter URL")
    }
}


function get_req_url() {
}

function output(text) {
    output_cont.innerHTML += text = "\n"
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