const start = new Date();
var date1 = new Date(2022, 0, 2);
console.log(date1.getTime()-start);

setMin();

function setMin() {
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
    alert(minutes);
}

function createAlarm() {
    var alarmLink = document.getElementById("link-input").value;
    var alarmDate = document.getElementById("selected-time").value;
}
