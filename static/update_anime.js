function update_anime(anime_id) {
    fetch(`/anime_count/${anime_id}`)
    .then(resp=>{
        return resp.text()
    })
    .then(text=> {
        if (text == "False") {
            alert("Someting Went Wrong")
        }
        else {
            let count = Number(text)
            console.log(count)
            scrap(anime_id, count)
        }
    })
}

