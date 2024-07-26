var AnimeList = {
    anime_list: {},
    edit_key: null,
    oninit: ()=> {
        m.request({
            method: "GET",
            url: "/get_anime_list",
        }).then((result)=> {
            AnimeList.anime_list = result
        })
    },
    view: ()=> {
        return [
            m("input", {class: "input", type:"text", placeholder:"Search", autofocus:"autofocus", autocomplete:"off"}),
            m("div", {"id":"anime_list"},
                Object.keys(AnimeList.anime_list).map((key)=> {
                    return AnimeList.edit_key === key ?
                        m(EditAnime, {id: key, title: AnimeList.anime_list[key], cancel_edit: AnimeList.cancel_edit}):
                        m(AnimeRow, {id: key, title: AnimeList.anime_list[key], edit_title: AnimeList.edit_title})
                })
            )
        ]
    },
    edit_title(id) {
        AnimeList.edit_key = id
    },
    cancel_edit() {
        AnimeList.edit_key = null
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
                m("button", {class: "btn btn-sm btn-danger", type: "button", onclick: "del_anime(${i})"},
                    m("img", {src: "/static/trash.webp"})
                )
            ]
        )
    }
}

var EditAnime = {
    view: (vnodes)=> {
        return m("div", {class: "row"},
            [
                m("input", {class: "btn input-title", type: "text", placeholder: "Title", value: vnodes.attrs.title}),
                m("button", {class: "btn btn-sm btn-primary", type: "button", onclick: "save_title(${i})"}, 
                    m("img", {src: "/static/floppy.webp"})
                ),
                m("button", {class: "btn btn-sm btn-danger", type: "button", onclick: vnodes.attrs.cancel_edit}, 
                    m("img", {src: "/static/cancel.webp"})
                )
            ]
        )
    }
}
