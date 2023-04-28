var links_container = document.getElementById("links_container")
var download_frame = document.getElementById("download_frame")
var title = document.getElementById("title")
var all_links;
var ep = localStorage.getItem("ep")


fetch('/get', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
   .then(response => response.json())
   .then(response => {
      show_links(response)
      init()
   })

function create_link(title, link) {
  const btn = document.createElement("button")
  let ep = title.split(" ")[3]
  btn.innerText = `EP | ${ep}`
  btn.className = "btn-ep"
  btn.onclick = ()=> {setEP(ep)}
  links_container.appendChild(btn)
}

function show_links(data) {
  all_links = data
  for (let i=0;i<data.length;i++) {
    create_link(data[i][0], data[i][1])
  }
}

// function go(link) {window.location.href = link}

function isNumber(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && !isNaN(parseFloat(str))
}

function setEP(num) {
  if (isNumber(num) || Number.isInteger(num)) {
    ep = parseInt(num)
    localStorage.setItem("ep", ep)
    console.log(ep)

    let episode_index = all_links.length - ep
    let current_ep = all_links[episode_index]
    download_frame.src = current_ep[1]
    title.innerText = current_ep[0]
  }
}

function init() {
  if ( isNumber(ep) ) {
    setEP(ep)
  }
  else {
    setEP(1)
  }
}

function next_ep() {
  var nxt_ep = ep + 1;
  if (nxt_ep <= all_links.length) {
    setEP(nxt_ep)
  }
}
function prev_ep() {
  var prv_ep = ep - 1;
  if (prv_ep > 0) {
    setEP(prv_ep)
  }
}
