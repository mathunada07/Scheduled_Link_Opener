// listens to messages sent from popup.js.
chrome.runtime.onMessage.addListener(function (message) {
    // Clears all alarms
    if (message == "clear") {
        chrome.alarms.clearAll();
    }
    // Sends information of stored alarms to popup.js to create a visual list of alarms upon 
    //   reopening the extension.
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
    // creates or removes an alarm depending on the value of message.remove.
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

// Opens a new tab of the link (alarm's name) when the alarm fires.
chrome.alarms.onAlarm.addListener(openLink);

function openLink(alarm) {
    chrome.tabs.create({ url: alarm.name });
    chrome.alarms.clear(alarm.name);
}
