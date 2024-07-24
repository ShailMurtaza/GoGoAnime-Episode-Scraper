const root = document.body
// m.route.prefix = "#"

var Layout = {
    view: (vnode)=> {
        return [
            m("nav", [
                m(m.route.Link, {"class":"nav-btn","href":"/"},
                    "ANIME LIST"
                ),
                m(m.route.Link, {"class":"nav-btn","href":"/scrap"},
                    "SCRAPING"
                )
            ]),
            m("main", vnode.children)
        ]
    }
}

m.route(root, "/", {
    "/": {
        render: ()=> {
            return m(Layout, m("h1", "Anime List"))
        }
    },
    "/scrap": {
        render: ()=> {
            return m(Layout, m("h1", "Scraping"))
        }
    }
})

