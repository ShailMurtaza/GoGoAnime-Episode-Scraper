var AnimeList = {
    anime_list: {},
    edit_key: null,
    search: "",
    oninit: ()=> {AnimeList.fetch_anime_list()},
    view: ()=> {
        return [
            m("input", {class: "input", type:"text", placeholder:"Search", autofocus:"autofocus", autocomplete:"off", oninput: (e)=> {
                AnimeList.search = e.target.value
            }}),
            m("div", {"id":"anime_list"},
                AnimeList.gen_list()
            )
        ]
    },
    fetch_anime_list: ()=> {
        m.request({
            method: "GET",
            url: "/get_anime_list",
        }).then((result)=> {
            AnimeList.anime_list = result
        })
    },
    gen_list: ()=> {
        const word = AnimeList.search.trim().toLowerCase() // Get search keyword
        return Object.keys(AnimeList.anime_list).map((key)=> {
            let title = AnimeList.anime_list[key]
            // If word is substring of title only then create new anime row
            if (title.toLowerCase().includes(word))
                return AnimeList.edit_key === key ?
                    m(EditAnime, {id: key, title: title, cancel_edit: AnimeList.cancel_edit, save_title: AnimeList.save_title}):
                    m(AnimeRow, {id: key, title: title, edit_title: AnimeList.edit_title, delete: AnimeList.delete})
        })
    },
    edit_title: (id)=> {
        AnimeList.edit_key = id
    },
    cancel_edit: ()=> {
        AnimeList.edit_key = null
    },
    save_title: (id, title)=> {
        m.request({
            method: "POST",
            url: "/edit_title/" + id,
            body: {title: title}
        }).then((result)=> {
            var result = result.result
            if (result == false) alert("Anime Not Found")
            else AnimeList.anime_list[id] = result
            AnimeList.edit_key = null
        })
    },
    delete(id) {
        var ans = confirm(`You Sure you want to delete ANIME: ${AnimeList.anime_list[id]}`)
        if (!ans) return
        m.request({
            method: "GET",
            url: `/del_anime/${id}`
        }).then((result)=> {
            var result = result.result
            if (result == false) alert("Anime Not Found")
            else {
                delete AnimeList.anime_list[result]
            }
        })
    }
}

var AnimeRow = {
    view: (vnodes)=> {
        return m("div", {class: "row"},
            [
                m("a", {class: "btn btn-orange link","href":"/get_anime/${i}"},
                    m("b", vnodes.attrs.title)
                ),
                m("button", {class: "btn btn-sm btn-primary", type: "button", onclick: ()=> {
                    vnodes.attrs.edit_title(vnodes.attrs.id)
                }},
                    m("img", {src: "/static/img/pencil.webp"})
                ),
                m(m.route.Link, {
                    href: `/update/${vnodes.attrs.id}`,
                    selector: "button",
                    class: "btn btn-sm btn-update",
                },
                    m("img", {src: "/static/img/update.webp"})
                ),
                m("button", {class: "btn btn-sm btn-danger", type: "button", onclick: ()=> {
                    vnodes.attrs.delete(vnodes.attrs.id)
                }},
                    m("img", {src: "/static/img/trash.webp"})
                )
            ]
        )
    }
}

var EditAnime = {
    oninit: (vnodes)=> {
        vnodes.state.value = vnodes.attrs.title
    },
    view: (vnodes)=> {
        return m("div", {class: "row"},
            [
                m("input", {class: "btn input-title", type: "text", placeholder: "Title", value: vnodes.state.value, oninput: (e)=> {
                    vnodes.state.value = e.target.value
                }}),
                m("button", {class: "btn btn-sm btn-primary", type: "button", onclick: ()=> {
                    vnodes.attrs.save_title(vnodes.attrs.id, vnodes.state.value)
                }}, 
                    m("img", {src: "/static/img/floppy.webp"})
                ),
                m("button", {class: "btn btn-sm btn-danger", type: "button", onclick: vnodes.attrs.cancel_edit}, 
                    m("img", {src: "/static/img/cancel.webp"})
                )
            ]
        )
    }
}
