const root = document.body
m.route.prefix = "#"

var Layout = {
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
                vnode.attrs.title
            ),
            m("main", vnode.children)
        ]
    }
}

m.route(root, "/", {
    "/": {
        render: ()=> {
            return m(Layout, {title: "Anime List"}, m(AnimeList))
        }
    },
    "/scrap": {
        render: ()=> {
            return m(Layout, {title: "Scraping"}, m(Scrap))
        }
    }
})

