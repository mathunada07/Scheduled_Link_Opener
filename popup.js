window.addEventListener("load", initializeExtension());

function initializeExtension() {
    restrictTime();

    chrome.runtime.sendMessage("loaded");
}

function restrictTime() {
    const start = new Date();
    var year = start.getFullYear();
    var month = start.getMonth()+1;
    var day = start.getDate();
    var hours = start.getHours();
    var minutes = start.getMinutes()+1;
    var dateString = "";

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (day < 10) {
        day = "0" + day;
    }

    if (month < 10) {
        month = "0" + month;
    } 

    dateString = year + "-" + month + "-" + day + "T" + hours + ":" + minutes;

    document.getElementById("selected-time").min = dateString;
}

document.getElementById("alarm-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var alarmLink = generateUniqueLink(document.getElementById("link-input").value);
    var alarmDate = new Date(document.getElementById("selected-time").value);
    document.getElementById("link-input").value = "";
    document.getElementById("selected-time").value = "";


    createListItem(alarmLink, alarmDate.toLocaleString("en-CA"));

    chrome.runtime.sendMessage({remove: false, link: alarmLink, time: alarmDate.getTime()});
});

function removeElement(id) {
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

function createListItem(link, date) {
    var itemDiv = document.createElement("div");
    itemDiv.className = "url-display";
    itemDiv.id = link;

    var extensionContent = document.getElementsByClassName("extension-content")[0];
    extensionContent.appendChild(itemDiv);

    var linkDiv = document.createElement("div");
    linkDiv.className = "link-holder"
    itemDiv.appendChild(linkDiv);

    var linkElement = document.createElement("a");
    linkElement.href = link;
    linkElement.innerHTML = link;
    linkDiv.appendChild(linkElement);

    var dateElement = document.createElement("p");
    dateElement.innerHTML = date;
    itemDiv.appendChild(dateElement);

    var removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove";
    itemDiv.appendChild(removeButton);

    removeButton.addEventListener("click", function(event) {
        removeElement(link);
        chrome.runtime.sendMessage({remove: true, link: link});
    })
}

function generateUniqueLink(link) {
    var finalLink = link;
    var counter = 0;

    while (document.getElementById(finalLink) != null) {
        if (document.getElementById(finalLink + "#" + counter) == null) {
            finalLink = finalLink + "#" + counter;
            break;
        } else {
            counter += 1;
        }
    }

    return finalLink;
}

document.getElementById("clear-button").addEventListener("click", function(event) {
    event.preventDefault();
    chrome.runtime.sendMessage("clear");
    var extensionContent = document.getElementsByClassName("extension-content")[0];
    extensionContent.innerHTML = "";
})

chrome.runtime.onMessage.addListener(function (message) {
    createListItem(message.link, message.date);
});