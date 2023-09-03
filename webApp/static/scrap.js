const url_inp = document.getElementById("url_inp")
const output_div = document.getElementById("output")

const api_url = "https://ajax.gogo-load.com/ajax/load-list-episode" // API of GoGo Anime from where we can fetch ul list of all animes


function scrap() {
    let anime_url = url_inp.value
    if (anime_url) {
        anime_url = btoa(anime_url)
        fetch_data("/fetch/" + anime_url)
    }
    else console.error("Enter URL")
}


function get_req_url() {
}

function fetch_data(url) {
    console.log("URL: " + url)
    fetch(url).then(resp=> {
        return resp.text()
    }).then(data=> {
        console.log("FETCH: " + data)
    })
}