const url_inp = document.getElementById("url_inp")
const output_cont = document.getElementById("output")
const scrap_btn = document.getElementById("scrap_btn")
const scrap_stop_btn = document.getElementById("scrap_stop_btn")
const api_url = "https://ajax.gogo-load.com/ajax/load-list-episode" // API of GoGo Anime from where we can fetch ul list of all animes
const parser = new DOMParser();
var scrapping = true // Set scrappnig as True at start

// To bypass caching
scrap_btn.disabled = false // enable scrap button
scrap_stop_btn.disabled = true // disable scraping stop button


async function scrap(anime_id, ep_start) {
    try {
        output("") // Clear Output
        let anime_url = url_inp.value.trim() // get url from input box
        if (!anime_url) { // if url_inp is empty
            output("Enter URL")
            return
        }
        scrap_btn.disabled = true // disable scrap button
        scrap_stop_btn.disabled = false // enable scraping stop button

        output("FETCHING ...")
        let html = await fetch_data(anime_url, ep_start) // get HTML data of url using fetch api of server
        if (html == "False") {
            throw "False Output"
        }
        output("FETCHED ...")

        let result = gen_url(html, ep_start) // generate full GoGo Anime URL to fetch links of all episodes
        if (result == false) {
            throw "<b>Nothing new to fetch</b>"
        }
        [full_api_url, alias] = result
        output(`ALIAS: ${alias}`)
        output(`URL: ${full_api_url}`)

        html = await fetch_data(full_api_url) // get HTML data of url using fetch api of server
        if (html == "False") {
            throw "False Output"
        }
        let url_list = get_url_list(html, anime_url)
        if (html == "") {
            throw "API URL response is empty. I guess something wrong with GoGoAnime 🤷‍♂️"
        }
        output("Fetching Download List ...")
        let ep_list = await get_download_list(url_list)
        output("Done Fetching Download List ...")
        output(`<b>Fetched: ${ep_list.length} Episodes</b>`)
        output("Saving data in database ...")
        result = await save_anime(alias, ep_list, anime_url, anime_id)
        if (result == "True") {
            output("<b>Data Saved Successfully ...</b>")
        }
        else {
            throw `Output: ${result}`
        }
    } catch (error) {
        output(`<span class="error">Something Went Wrong ...</span>`)
        output(`<span class="error">ERROR: ${error}</span>`)
        console.error(error)
    }
    scrap_btn.disabled = false // enable scrap button
    scrap_stop_btn.disabled = true // disable scraping stop button
    scrapping = true
}


async function get_download_list(url_list) {
    try {
        let ep_list = []
        for(let i=url_list.length-1;i > -1 && scrapping;i--) {
            let html = await fetch_data(url_list[i])
            let [title, url] = get_download_data(html)
            ep_list.push([title, url])
            output(title)
        }
        return ep_list
    }
    catch (err) {
        throw err
    }
}


// Return title of current episode with download link
function get_download_data(data) {
    let htmlDoc = HTML(data) // Parse HTML

    let title = htmlDoc.querySelector(".title_name > h2").innerHTML
    let link = htmlDoc.querySelector(".dowloads > a").getAttribute("href")
    return [title, link]
}


// data will have <ul> tag with <li> and within <li> there will be <a href="one episode URL">
function get_url_list(data, anime_url) {
    let htmlDoc = HTML(data) // Parse HTML
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
function gen_url(data, ep_start=null) {
    let htmlDoc = HTML(data) // Parse HTML
    // get all parameters to generate URL of GoGo Anime API
    let episode_page = htmlDoc.getElementById("episode_page")
    let a_href = episode_page.getElementsByTagName("a")

    if (!ep_start) {
        ep_start = Number(a_href[0].getAttribute("ep_start"))
    }
    ep_start++
    let ep_end = a_href[a_href.length - 1].getAttribute("ep_end")
    let anime_id = htmlDoc.getElementById("movie_id").value
    let default_ep = htmlDoc.getElementById("default_ep").value
    let alias = htmlDoc.getElementById("alias_anime").value

    if (ep_start > ep_end) {
        return false
    }
    let url = `${api_url}?ep_start=${ep_start}&ep_end=${ep_end}&id=${anime_id}&default_ep=${default_ep}&alias=${alias}`
    return [url, alias]
}


async function fetch_data(url) {
    url = btoa(url) // encode url with base64
    try {
        const response = await fetch("/fetch/" + url)
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


async function save_anime(title, ep_list, anime_url, anime_id) {
    try {
        const response = await fetch("/save_anime", {
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": JSON.stringify({"title": title, "ep_list": ep_list, "anime_url": anime_url, 'anime_id': anime_id})
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response}`)
        }
        const data = await response.text()
        return data
    } catch(error) {
        console.error("ERROR: ", error)
        throw error
    }
}


// Stop scrapping in middle
function scrap_stop() {
    scrapping = false
}


function output(text) {
    if (text) {
        text += "</br>"
        let htmlDoc = HTML(text)
        while (htmlDoc.body.firstChild) {
            output_cont.appendChild(htmlDoc.body.firstChild);
        }
    }
    else
        output_cont.innerHTML = ""
}


// Prase string as HTML DOM
function HTML(string) {
    let htmlDoc = parser.parseFromString(string, "text/html") // Parse HTML
    return htmlDoc
}
