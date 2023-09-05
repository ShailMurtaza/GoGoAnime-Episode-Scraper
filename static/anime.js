const anime_div = document.getElementById("anime_list")
const search_inp = document.getElementById("search")


function search() {
    const word = search_inp.value.trim().toLowerCase()
    let anime_list = {}
    for (const i in full_anime_list) {
        let title = full_anime_list[i].toLowerCase()
        if (title.includes(word)) anime_list[i] = title
    }
    show_anime(anime_list)
}


// display anime list
function show_anime(anime_list) {
    anime_div.innerHTML = ""
    for (const i in anime_list) {
        anime_div.innerHTML += `<div class="row">
            <a class="btn btn-orange" href="/get_anime/${i}"><b>${anime_list[i]}</b></a>
            <button type="button" class="btn btn-danger" onclick="del_anime(${i})"><img src="/static/trash.png"></button>
        </div>`
    }
}


function del_anime(ID) {
    let ans = confirm(`You Sure you want to delete ANIME: ${full_anime_list[ID]}`)
    if (ans) {
        window.location.href = "/del_anime/" + ID
    }
}

show_anime(full_anime_list) // Show all anime at start