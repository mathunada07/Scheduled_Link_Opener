// Upon reopening the extension's window, "loaded" is sent to background.js, 
//   which returns a list of properties of stored alarms.
window.addEventListener("load", initializeExtension());
function initializeExtension() {
    restrictTime();

    chrome.runtime.sendMessage("loaded");
}


// When background.js sends alarm information back to popup.js, the information is converted into
//   elements that add an item to the visual list in the popup.
chrome.runtime.onMessage.addListener(function (message) {
    createListItem(message.link, message.date);
});

// Given a link (string) and a date (in localeTimeString (en-CA) format), produces a visual representation
//   of the user's inputted properties as an item in an editable list.
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


// Restricts the time the user can input to one minute past when the popup window was opened.
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

// When the form is submitted, sends the inputted properties to background.js to create an alarm.
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

// Due to the limitation of Chrome Alarms API, where alarms with the same name are overwritte with the most
//   recently created alarm, this function generates a unique hash to add to the end of the link.
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

// When the clear button is clicked, a message "clear" is sent to background.js to clear all existing
//   alarms.
document.getElementById("clear-button").addEventListener("click", function(event) {
    event.preventDefault();
    chrome.runtime.sendMessage("clear");
    var extensionContent = document.getElementsByClassName("extension-content")[0];
    extensionContent.innerHTML = "";
})