var galleryID = (new URLSearchParams(location.search)).get("username");
if (!galleryID) location.replace("error.html?msg=" + encodeURIComponent("Missing param `username`"));

var urlToFetch = `https://backend.deviantart.com/rss.xml?q=gallery:${galleryID}&type=deviation`;

var xhttp = new XMLHttpRequest();
xhttp.open("GET", urlToFetch, false);
xhttp.send();
var resultDoc = xhttp.responseXML;

if (resultDoc.querySelectorAll("item").length == 0) location.replace("error.html?msg=" + encodeURIComponent("No data for username `" + galleryID + "`"));

var images = [];
for (var item of resultDoc.querySelectorAll("item")) {
    images.push({
        thumb: item.getElementsByTagName("media:thumbnail")[1].getAttribute("url"),
        name: item.querySelector("title").innerHTML,
        uri: item.querySelector("link").innerHTML
    });
}

(function(data) {
    var wrapper = document.querySelector("#gallery");
    wrapper.className = "row";
    const colheight = Math.ceil(data.length / 4);
    for (var i = 0; i < data.length; i++) {
        if (i % colheight == 0) {
            var rowElement = document.createElement("div");
            rowElement.className = "column";
            wrapper.appendChild(rowElement);
        }
        var datapoint = data[i];
        var thumb = new Image();
        thumb.src = datapoint.thumb;
        thumb.alt = datapoint.name;
        thumb.style.width = "100%";
        thumb.style.cursor = "pointer";
        thumb.addEventListener("click", new Function(`
            var a = document.createElement("a");
            a.href = "${datapoint.uri}";
            a.target = "_blank";
            a.click();
            a.remove();
        `));
        thumb.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            this.click();
        });
        rowElement.appendChild(thumb);
    }
})(images);