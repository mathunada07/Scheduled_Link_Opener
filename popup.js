const start = new Date();
window.addEventListener("load", initializeExtension());

function initializeExtension() {
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
    var alarmLink = document.getElementById("link-input").value;
    var alarmDate = new Date(document.getElementById("selected-time").value);
    alert(alarmLink);
    console.log(alarmDate.getTime());
    chrome.runtime.sendMessage({link: alarmLink, time: alarmDate.getTime()});
    console.log("alarm sent!");
});