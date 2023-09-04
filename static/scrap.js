const url_inp = document.getElementById("url_inp")
const output_cont = document.getElementById("output")
const scrap_btn = document.getElementById("scrap_btn")
const api_url = "https://ajax.gogo-load.com/ajax/load-list-episode" // API of GoGo Anime from where we can fetch ul list of all animes
const parser = new DOMParser();


async function scrap() {
    output("") // Clear Output
    let anime_url = url_inp.value.trim() // get url from input box
    if (!anime_url) { // if url_inp is empty
        output("Enter URL")
        return
    }
    scrap_btn.disabled = true // disable scrap button
    // if input box is not empty

    output("FETCHING ...")
    let html = await fetch_data("/main_url/fetch") // get HTML data of url using fetch api of server
    output("FETCHED ...")
    let [full_api_url, alias] = gen_url(html) // generate full GoGo Anime URL to fetch links of all episodes
    output(`ALIAS: ${alias}`)
    output(`URL: ${full_api_url}`)

    full_api_url = btoa(full_api_url)
    html = await fetch_data("/url_list/fetch") // get HTML data of url using fetch api of server
    let url_list = get_url_list(html, anime_url)
    output("Fetching Download List ...")
    let ep_list = await get_download_list(url_list)
    output("Done Fetching Download List ...")
    output("Saving data in database ...")
    let result = await save_anime(alias, ep_list)
    if (result == "True") {
        output("<b>Data Saved Successfully ...</b>")
    }
    else {
        output("<i><b>Something Went Wrong ...</b></i>")
    }
    scrap_btn.disabled = false // enable scrap button
}


async function get_download_list(url_list) {
    let ep_list = []
    for(let i=0;i<2;i++) { // Divide length for fast result. Since it is testing phase
        let html = await fetch_data("/fetch/" + btoa(url_list[i]))
        let [title, url] = get_download_data(html)
        ep_list.push([title, url])
        output(title)
    }
    return ep_list
}


// Return title of current episode with download link
function get_download_data(data) {
    let htmlDoc = parser.parseFromString(data, "text/html") // Parse HTML

    let title = htmlDoc.querySelector(".title_name > h2").innerHTML
    let link = htmlDoc.querySelector(".dowloads > a").getAttribute("href")
    return [title, link]
}


// data will have <ul> tag with <li> and within <li> there will be <a href="one episode URL">
function get_url_list(data, anime_url) {
    let htmlDoc = parser.parseFromString(data, "text/html") // Parse HTML
    let a_href = htmlDoc.getElementsByTagName("a")
    let url_list = [] // array to store all episodes links

    anime_url = new URL(anime_url) // For url parsing
    let main_url = `${anime_url.protocol}//${anime_url.hostname}` // get url without path
    for (let i=0;i<a_href.length;i++) {
        let link = main_url + a_href[i].getAttribute("href").trim() // main url of GoGo anime + episode path taken fron API
        url_list.push(link)
    }
    return url_list
}

// Return full API URL for given anime data. It will content of that URL html will contain <ul> with <li> and <a>. Every episode link will be separated by different <a> tag
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
    return [url, alias]
}


async function fetch_data(url) {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.text()
        return data
    } catch (error) {
        console.error("ERROR:", error)
        throw error // Rethrow the error for the caller to handle
    }
}


async function save_anime(title, ep_list) {
    try {
        const response = await fetch("/save_anime", {
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": JSON.stringify({"title": title, "ep_list": ep_list})
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response}`)
        }
        const data = await response.text()
        return data
    } catch(error) {
        console.error("ERROR:", error)
    }
}


function output(text) {
    if (text)
        output_cont.innerHTML += text + "</br>"
    else
        output_cont.innerHTML = ""
}
