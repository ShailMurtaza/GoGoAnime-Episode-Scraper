var EpList = {
    anime_id: null,
    ep_link: "",
    ep_list: [],
    oninit: async (vnode)=> {
        Layout.updateTitle("Anime Episodes")
        EpList.anime_id = vnode.attrs.ID
        const data = await EpList.fetch_data()
        EpList.ep_list = data.episodes
        EpList.set_episode(data.index)
    },

    view: ()=> {
        return [
            m("div", {class: "iframe_container"},
                m("iframe", {id: "download_frame", src: EpList.ep_link})
            ),
            m("div", {id: "anime_nav"},
                [
                    m("button", {class: "btn-nav", onclick: "prev_ep()"},
                        "PREVIOUS"
                    ),
                    m(m.route.Link, {class: "btn-nav", href: `/update/${EpList.anime_id}`},
                        "UPDATE"
                    ),
                    m("button", {class: "btn-nav", onclick: "next_ep()"},
                        "NEXT"
                    )
                ]
            ),
            m("div", {id: "links_container"}, EpList.show_list())
        ]
    },

    show_list: ()=> {
        let ep_list = []
        for (let i=EpList.ep_list.length;i>0;i--)
            ep_list.push(m("button", {class: "btn btn-orange btn-ep", onclick: ()=> {EpList.set_episode(i-1)}}, `EP | ${i}`))
        return ep_list
    },

    set_episode: (ep)=> {
        if (ep >= EpList.ep_list.length || ep < 0) {
            ep = 0
        }
        // fetch(`/set_index/${anime_id}/${ep}`).then(r=>{return r.text()}).then(text=>console.log("setEP Result:" , text))
        m.request({
            method: "GET",
            url: `/set_index/${EpList.anime_id}/${ep}`
        }).then((result)=> {
            console.log(`set_episode Result: ${result.result}, ${ep}`)
        })

        let current_ep = EpList.ep_list[ep]
        Layout.updateTitle(current_ep[0])
        EpList.ep_link = current_ep[1]
    },

    fetch_data: ()=> {
        return m.request({
            method: "GET",
            url: `/get_anime_ep/${EpList.anime_id}`,
        }).then((result)=> {
            return result
        })
    }
}

