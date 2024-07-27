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
            let result = await Scrap.fetch_data(anime_url)
            if (!result) throw "False Output. Check your URL and Try Again"
            output("Fetched ...")
        } catch (error) {
            output(m("span.error", "Something Went Wrong"))
            output(m("span.error", `ERROR: ${error}`))
        }
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
        })
        .then((result)=> {
            return result.result
        })
    }
}
