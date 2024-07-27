const api_url = "https://ajax.gogocdn.net/ajax/load-list-episode" // API of GoGo Anime from where we can fetch ul list of all animes
const parser = new DOMParser();

var Scrap = {
    scraping: true,
    input: "https://anitaku.pe/monster-dub-episode-1",
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
                onclick: "scrap_stop()",
            }, "STOP"), 
            m("p", Scrap.output_data.map((data)=> {
                return data
            }))
        ]
    },
    start: async ()=> {
        const output = Scrap.output
        try {
            output("") // Clear Output
            const anime_url = Scrap.input.trim() // Get inputbox URL
            if (!anime_url) {
                output("Enter Url")
                return
            }

            output("Fetching ...")
            let result = await Scrap.fetch_data(anime_url) // get HTML data of url using fetch api of server
            if (!result) throw "False Output. Check your URL and Try Again"
            output("Fetched ...")
            result = Scrap.gen_url(result) // generate full GoGo Anime URL to fetch links of all episodes
            if (!result) throw "Nothing new to fetch"
            const full_api_url = result[0]
            const alias = result[1]
            output(`ALIAS: ${alias}`)
            output(`URL: ${full_api_url}`)

            result = await Scrap.fetch_data(full_api_url) // get HTML data of url using fetch api of server
            if (!result) throw "False Output"
            else if (result == "") throw "API URL response is empty. I guess something wrong with GoGoAnime 🤷‍♂️"
            let url_list = Scrap.get_url_list(result, anime_url)
            console.log(url_list)
        } catch (error) {
            output(m("span.error", "Something Went Wrong"))
            output(m("span.error", `ERROR: ${error}`))
            console.error(error)
        }
    },
    // Return full API URL for given anime data. It will content of that URL html will contain <ul> with <li> and <a>. Every episode link will be separated by different <a> tag
    gen_url: (html, ep_start=null)=> {
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
    // Prase string as HTML DOM
    HTML: (string)=> {
        let htmlDoc = parser.parseFromString(string, "text/html") // Parse HTML
        return htmlDoc
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
