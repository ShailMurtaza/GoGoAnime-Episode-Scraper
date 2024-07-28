var EpList = {
    anime_id: null,

    oninit: (vnode)=> {
        EpList.anime_id = vnode.attrs.ID
        Layout.updateTitle("Anime Episodes")
    },

    view: ()=> {
        return [
            m("div", {class: "iframe_container"},
                m("iframe", {id: "download_frame"})
            ),
            m("div", {id: "anime_nav"},
                [
                    m("button", {class: "btn-nav", onclick: "prev_ep()"},
                        "PREVIOUS"
                    ),
                    m(m.route.Link, {class: "btn-nav", href: `/update/${EpList.anime_id}`},
                        "UPDATE"
                    ),
                    m("button", {class: "btn-nav float", onclick: "next_ep()"},
                        "NEXT"
                    )
                ]
            ),
            m("div", {id: "links_container"})
        ]
    }
}

