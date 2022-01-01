chrome.runtime.onMessage.addListener(function (message) {
    console.log("got called");
    console.log(message);
    if (message.link != "" && message.time != null) {
        var alarmLink = message.link;
        var alarmTime = message.time;
        chrome.alarms.create(
            alarmLink, {
            when: alarmTime
        });
        console.log("alarm created!");
    }
});

chrome.alarms.onAlarm.addListener(openLink);

function openLink(alarm) {
    chrome.tabs.create({ url: alarm.name });
    console.log("new tab created!");
}
