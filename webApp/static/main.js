var links_container = document.getElementById("links_container")
var download_frame = document.getElementById("download_frame")
var title = document.getElementById("title")
var all_links;
var ep = localStorage.getItem("ep")
var ep_index = -1;

fetch('/get', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
   .then(response => response.json())
   .then(response => {
      init(response)
   })

function create_link(title, link) {
  const btn = document.createElement("button")
  let ep = title.split(" ")[ep_index]
  btn.innerText = `EP | ${ep}`
  btn.className = "btn-ep"
  btn.onclick = ()=> {setEP(ep)}
  links_container.appendChild(btn)
}

function show_links(data) {
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

function init(response) {
  all_links = response
  if ( isNumber(ep) ) {
    setEP(ep)
  }
  else {
    setEP(1)
  }
  let first_title = all_links[0][0].split(" ")
  // Find index of episode number by iterating over first episode title
  for (let i = 0; i < first_title.length; i++) {
    if (isNumber(first_title[i])) {
      ep_index = i // set index to global variable ep_index
      show_links(all_links) // create all links at bottom of web page
      break
    }
  }
  if (ep_index === -1)
    console.error("Unable to find Episode INDEX")
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
