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
        anime_div.innerHTML += `<a class="btn btn-orange" href="/get_anime/${i}"><b>${anime_list[i]}</b></a>`
    }
}

show_anime(full_anime_list) // Show all anime at start