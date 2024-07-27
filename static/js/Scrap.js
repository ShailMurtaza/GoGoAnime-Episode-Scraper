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
            result = Scrap.gen_url(result)
            if (!result) throw "Nothing new to fetch"
            const full_api_url = result[0]
            const alias = result[1]
            output(`ALIAS: ${alias}`)
            output(`URL: ${full_api_url}`)
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
