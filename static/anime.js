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
        anime_div.innerHTML += `
        <div class="row" id="anime_row_${i}">
            <a id="link_${i}" class="btn btn-orange link" href="/get_anime/${i}"><b>${anime_list[i]}</b></a>
            <button type="button" class="btn btn-sm btn-primary" onclick="edit_title(${i})"><img src="/static/pencil.webp"></button>
            <button class="btn btn-sm btn-update" onclick=update(${i})><img src="/static/update.webp"></button>
            <button type="button" class="btn btn-sm btn-danger" onclick="del_anime(${i})"><img src="/static/trash.webp"></button>
        </div>
        <div class="row edit_title" id="edit_title_row_${i}">
            <input id="input_${i}" type="text" class="btn input-title" placeholder="Title" value="${anime_list[i]}">
            <button type="button" class="btn btn-sm btn-primary" onclick="save_title(${i})"><img src="/static/floppy.webp"></button>
            <button type="button" class="btn btn-sm btn-danger" onclick="hide_edit_title(${i})"><img src="/static/cancel.webp"></button>
        </div>
        `
    }
}


function del_anime(ID) {
    let ans = confirm(`You Sure you want to delete ANIME: ${full_anime_list[ID]}`)
    if (ans) {
        window.location.href = "/del_anime/" + ID
    }
}


function edit_title(ID) {
    let anime_row = document.getElementById("anime_row_" + ID)
    let edit_title_row = document.getElementById("edit_title_row_" + ID)

    anime_row.style.display = "none"
    edit_title_row.style.display = "flex"
}


function hide_edit_title(ID) {
    let anime_row = document.getElementById("anime_row_" + ID)
    let edit_title_row = document.getElementById("edit_title_row_" + ID)

    anime_row.style.display = "flex"
    edit_title_row.style.display = "none"
}


async function save_title(ID) {
    let title_inp = document.getElementById("input_" + ID)
    let title = title_inp.value
    let link = document.getElementById("link_" + ID)
    if (title) {
        try {
            const response = await fetch("/edit_title/" + ID, {
                "method": "POST",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify({"title": title})
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response}`)
            }
            const data = await response.text()
            if (data == "False") {
                alert("False!")
            }
            else {
                link.innerHTML = `<b>${data}</b>`
                title_inp.value = data
            }
            hide_edit_title(ID)
        } catch(error) {
            alert("ERROR, check console!")
            console.error("ERROR:", error)
        }
    }
}

function update(i) {
    window.location.href = "/update_anime/" + i
}

show_anime(full_anime_list) // Show all anime at start
