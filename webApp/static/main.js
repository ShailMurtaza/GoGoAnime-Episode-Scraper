var links_container = document.getElementById("links_container")
var all_links
var all_links_btn = []

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


fetch('/get', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
   .then(response => response.json())
   .then(response => {
    show_links(response)
   })

function create_link(title, link) {
  const btn = document.createElement("button")
  btn.innerText = `EP | ${title.split(" ")[3]}`
  btn.className = "btn-ep"
  btn.onclick = ()=> {go(link)}
  links_container.appendChild(btn)
  all_links_btn.push(btn)
}

function show_links(data) {
  all_links = data
  for (let i=0;i<data.length;i++) {
    create_link(data[i][0], data[i][1])
  }
}


