var EpList = {
    anime_id: null,
    current_ep: null,
    ep_link: "",
    ep_list: [],
    oninit: async (vnode)=> {
        Layout.updateTitle("Anime Episodes")
        EpList.anime_id = vnode.attrs.ID
        const data = await EpList.fetch_data()
        EpList.current_ep = data.index
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
                    m("button", {class: "btn-nav", onclick: EpList.prev_ep},
                        "PREVIOUS"
                    ),
                    m(m.route.Link, {class: "btn-nav", href: `/update/${EpList.anime_id}`},
                        "UPDATE"
                    ),
                    m("button", {class: "btn-nav", onclick: EpList.next_ep},
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
        m.request({
            method: "GET",
            url: `/set_index/${EpList.anime_id}/${ep}`
        }).then((result)=> {
            console.log(`set_episode Result: ${result.result}, ${ep}`)
        })

        let ep_data = EpList.ep_list[ep]
        Layout.updateTitle(ep_data[0])
        EpList.ep_link = ep_data[1]
        EpList.current_ep = ep
    },

    next_ep: ()=> {
        let ep = EpList.current_ep + 1
        if (ep < EpList.ep_list.length)
            EpList.set_episode(ep)
    },

    prev_ep: ()=> {
        let ep = EpList.current_ep - 1
        if (ep > -1)
            EpList.set_episode(ep)
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

