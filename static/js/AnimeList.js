var AnimeList = {
    anime_list: {},
    edit_key: null,
    oninit: ()=> {AnimeList.fetch_anime_list()},
    view: ()=> {
        return [
            m("input", {class: "input", type:"text", placeholder:"Search", autofocus:"autofocus", autocomplete:"off"}),
            m("div", {"id":"anime_list"},
                Object.keys(AnimeList.anime_list).map((key)=> {
                    return AnimeList.edit_key === key ?
                        m(EditAnime, {id: key, title: AnimeList.anime_list[key], cancel_edit: AnimeList.cancel_edit, save_title: AnimeList.save_title}):
                        m(AnimeRow, {id: key, title: AnimeList.anime_list[key], edit_title: AnimeList.edit_title, delete: AnimeList.delete})
                })
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
                    m("img", {src: "/static/pencil.webp"})
                ),
                m("button", {class: "btn btn-sm btn-update", onclick: "update(${i})"},
                    m("img", {src: "/static/update.webp"})
                ),
                m("button", {class: "btn btn-sm btn-danger", type: "button", onclick: ()=> {
                    vnodes.attrs.delete(vnodes.attrs.id)
                }},
                    m("img", {src: "/static/trash.webp"})
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
                    m("img", {src: "/static/floppy.webp"})
                ),
                m("button", {class: "btn btn-sm btn-danger", type: "button", onclick: vnodes.attrs.cancel_edit}, 
                    m("img", {src: "/static/cancel.webp"})
                )
            ]
        )
    }
}
