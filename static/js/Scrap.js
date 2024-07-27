const api_url = "https://ajax.gogocdn.net/ajax/load-list-episode" // API of GoGo Anime from where we can fetch ul list of all animes
const parser = new DOMParser();

var Scrap = {
    anime_id: null,
    ep_start: null,
    scraping: true,
    input: "https://anitaku.pe/cardfight-vanguard-divinez-season-2-episode-4",
    // input: "https://wombo.jonmoasldf/monster-dub-episode-1",
    output_data: [],
    scrap_btn_disabled: false, // enable scrap button
    stop_btn_disabled: true, // disable scraping stop button
    view: ()=> {
        return [
            m("input", {
                class: "input",
                type: "text",
                placeholder: "Enter URL",
                value: Scrap.input,
                autocomplete: "off",
                oninput: (e)=> {
                    Scrap.input = e.target.value
                }
            }),
            m("button", {
                class: "btn btn-orange",
                type: "button",
                disabled: Scrap.scrap_btn_disabled,
                onclick: Scrap.start
            }, "SCRAP"),
            m("button", {
                class: "btn btn-orange",
                type: "button",
                disabled: Scrap.stop_btn_disabled,
                onclick: Scrap.stop,
            }, "STOP"), 
            m("p#output", Scrap.output_data.map((data)=> {
                return data
            }))
        ]
    },
    start: async ()=> {
        const output = Scrap.output
        try {
            output("") // Clear Output
            const anime_url = Scrap.input.trim() // Get inputbox URL
            if (!anime_url) throw "Enter Urlhttps://anitaku.pe/cardfight-vanguard-divinez-season-2-episode-ffff"
            Scrap.scrap_btn_disabled = true
            Scrap.stop_btn_disabled = false

            output("Fetching ...")
            let result = await Scrap.fetch_data(anime_url) // get HTML data of url using fetch api of server
            if (!result) throw "False Output. Check your URL and Try Again"
            output("Fetched ...")
            result = Scrap.gen_url(result) // generate full GoGo Anime URL to fetch links of all episodes
            if (!result) throw "Nothing new to fetch"
            const [full_api_url, alias] = result
            output(`ALIAS: ${alias}`)
            output(`URL: ${full_api_url}`)

            result = await Scrap.fetch_data(full_api_url) // get HTML data of url using fetch api of server
            if (!result) throw "False Output"
            else if (result == "") throw "API URL response is empty. I guess something wrong with GoGoAnime 🤷"
            let url_list = Scrap.get_url_list(result, anime_url)
            output("Fetching Download List ...")
            let ep_list = await Scrap.get_download_list(url_list)
            output("Done Fetching Download List ...")
            output(m("b", `Fetched: ${ep_list.length} Episodes`))
            output("Saving data in database ...")
            result = await Scrap.save_anime(alias, ep_list, anime_url)
            if (result) output(m("b", "Data Saved Successfully ..."))
            else throw `Output: ${result}`
        } catch (error) {
            output(m("span.error", "Something Went Wrong"))
            output(m("span.error", `ERROR: ${error}`))
            console.error(error)
        }

        // If scraping was stopped intentionally show message
        if (!Scrap.scraping) Scrap.output(m("b", "Stopped ..."))
        Scrap.scrap_btn_disabled = false // enable scrap button
        Scrap.stop_btn_disabled = true // disable scraping stop button
        Scrap.scraping = true
    },
    // Return full API URL for given anime data. It will content of that URL html will contain <ul> with <li> and <a>. Every episode link will be separated by different <a> tag
    gen_url: (html)=> {
        let ep_start = Scrap.ep_start
        let htmlDoc = Scrap.HTML(html) // Parse HTML
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
    },

    // data will have <ul> tag with <li> and within <li> there will be <a href="one episode URL">
    get_url_list: (data, anime_url)=> {
        let htmlDoc = Scrap.HTML(data) // Parse HTML
        let a_href = htmlDoc.getElementsByTagName("a")
        let url_list = [] // array to store all episodes links

        anime_url = new URL(anime_url) // For url parsing
        let main_url = `${anime_url.protocol}//${anime_url.hostname}` // get url without path
        for (let i=0;i<a_href.length;i++) {
            let link = main_url + a_href[i].getAttribute("href").trim() // main url of GoGo anime + episode path taken fron API
            url_list.push(link)
        }
        return url_list
    },

    get_download_list: async (url_list)=> {
        try {
            let ep_list = []
            console.log(url_list.length)
            for(let i=url_list.length-1;i > -1 && Scrap.scraping;i--) {
                let html = await Scrap.fetch_data(url_list[i])
                let [title, url] = Scrap.get_download_data(html)
                ep_list.push([title, url])
                Scrap.output(title)
            }
            return ep_list
        }
        catch (err) {
            throw err
        }
    },

    // Return title of current episode with download link
    get_download_data: (data)=> {
        let htmlDoc = Scrap.HTML(data) // Parse HTML

        let title = htmlDoc.querySelector(".title_name > h2").innerHTML
        let link = htmlDoc.querySelector(".dowloads > a").getAttribute("href")
        return [title, link]
    },

    save_anime: async (title, ep_list, anime_url)=> {
        let anime_id = Scrap.anime_id
        return m.request({
            method: "POST",
            url: "/save_anime",
            body: {
                title: title,
                ep_list: ep_list,
                anime_url: anime_url,
                anime_id: anime_id
            }
        }).then((result)=> {
            return result.result
        })
    },

    // Prase string as HTML DOM
    HTML: (string)=> {
        let htmlDoc = parser.parseFromString(string, "text/html") // Parse HTML
        return htmlDoc
    },

    // Stop scrapping in middle
    stop: ()=> {
        Scrap.scraping = false
    },

    output: (data)=> {
        if (data) Scrap.output_data.push(data, m("br"))
        else Scrap.output_data = []
    },

    fetch_data: (url)=> {
        return m.request({
            method: "POST",
            url: "/fetch",
            body: {url: url}
        }).then((result)=> {
            return result.result
        })
    }
}
