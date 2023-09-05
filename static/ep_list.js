var links_container = document.getElementById("links_container")
var download_frame = document.getElementById("download_frame")
var title = document.getElementById("title")


function create_link(title, link, ep_index) {
    const btn = document.createElement("button")
    btn.innerText = `EP | ${ep_index}`
    btn.className = "btn btn-orange btn-ep"
    btn.onclick = () => { setEP(ep_index-1) }
    links_container.appendChild(btn)
}

function show_links(data) {
    for (let i = 0; i < data.length; i++) {
        create_link(data[i][0], data[i][1], data.length - i)
    }
}


function isNumber(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && !isNaN(parseFloat(str))
}

function setEP(num) {
    if (isNumber(num) || Number.isInteger(num)) {
        ep = parseInt(num)
        if (ep >= all_links.length || ep < 0) {
            ep = 0
        }
        fetch(`/set_index/${anime_id}/${ep}`).then(r=>{return r.text()}).then(text=>console.log("setEP Result:" , text))

        let episode_index = all_links.length - ep - 1
        let current_ep = all_links[episode_index]
        download_frame.src = current_ep[1]
        title.innerText = current_ep[0]
    }
}


setEP(ep)
show_links(all_links) // create all links at bottom of web page

function next_ep() {
    var nxt_ep = ep + 1;
    if (nxt_ep < all_links.length) {
        setEP(nxt_ep)
    }
}
function prev_ep() {
    var prv_ep = ep - 1;
    if (prv_ep >= 0) {
        setEP(prv_ep)
    }
}
