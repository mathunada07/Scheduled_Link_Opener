chrome.runtime.onMessage.addListener(function (message) {
    if (message == "clear") {
        chrome.alarms.clearAll();
    }
    else if (message == "loaded") {
        var alarmsArray = chrome.alarms.getAll();
        alarmsArray.then(function (result) {
            for (let i = 0; i < result.length; i++) {
                console.log("processing");
                var alarmLink = result[i].name;
                var alarmDate = new Date(result[i].scheduledTime);
                chrome.runtime.sendMessage({ link: alarmLink, date: alarmDate.toLocaleString("en-CA")});
            }
        });
    }
    var alarmLink = message.link;
    if (message.remove == true) {
        chrome.alarms.clear(alarmLink);
    }
    else if (message.remove == false) {
        var alarmTime = message.time;
        chrome.alarms.create(
            alarmLink, {
            when: alarmTime
        });
    }
});

chrome.alarms.onAlarm.addListener(openLink);

function openLink(alarm) {
    chrome.tabs.create({ url: alarm.name });
    chrome.alarms.clear(alarm.name);
}
