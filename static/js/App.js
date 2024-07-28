const root = document.body
m.route.prefix = "#"


var Layout = {
    TITLE: "",
    updateTitle: (title)=> {
        Layout.TITLE = title
        m.redraw()
    },
    view: (vnode)=> {
        return [
            m("nav", [
                m(m.route.Link, {class: "nav-btn", href: "/"},
                    "ANIME LIST"
                ),
                m(m.route.Link, {class: "nav-btn", href: "/scrap"},
                    "SCRAPING"
                )
            ]),
            m("h1", {class:"title"},
                Layout.TITLE
            ),
            m("main", vnode.children)
        ]
    }
}


m.route(root, "/", {
    "/": {
        render: ()=> {
            return m(Layout, m(AnimeList))
        }
    },
    "/scrap": {
        render: ()=> {
            return m(Layout, m(Scrap, {ID: null}))
        }
    },
    "/update/:ID": {
        render: (vnode)=> {
            return m(Layout, m(Scrap, {ID: vnode.attrs.ID}))
        }
    },
    "/get_anime/:ID": {
        render: (vnode)=> {
            return m(Layout, m(EpList, {ID: vnode.attrs.ID}))
        }
    }
})

