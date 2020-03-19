function resizeIFrame(iframe) {
    iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
}

function setCurrentTimeSpan(currentTimestampSpanID) {
    var date = new Date();
    timeElement = document.getElementById(currentTimestampSpanID);
    timeElement.innerHTML = date.getTime();
}

function setTimestampFromFile(timestampSpanElementID, timestampFrameElementID) {
    var timestampContents = document.getElementById(timestampFrameElementID).contentDocument.body.childNodes[0].innerHTML;
    var date = new Date(1000*parseInt(timestampContents)); // unix time is in seconds, JS time is in milliseconds
    var timestampSpan = document.getElementById(timestampSpanElementID);
    timestampSpan.innerHTML = date.getTime();
}

function setTimeFromTimestamp(timeSpanElementID, timestampSpanElementID) {
    var timestampValue = new Date(parseInt(document.getElementById(timestampSpanElementID).innerHTML));
    document.getElementById(timeSpanElementID).innerHTML = timestampValue.toString();
}

function getTimeDifferenceReadable(timeDifference) {
    absTimeDifference = parseInt(timeDifference);
    relativeTimeIdentifier = " ago";
    if (absTimeDifference < 0) {
        // hopefully this shouldn't occur...
        absTimeDifference = (-1)*absTimeDifference;
        relativeTimeIdentifier = " from now";
    }
    tolerance = 0.1 // doesn't matter as long as this is less than 0.99
    differenceString = ""
    // timestamps are in milliseconds
    timeDifferenceDays = Math.floor(absTimeDifference/(24*60*60*1000.0));
    if (timeDifferenceDays > tolerance) {
        differenceString += timeDifferenceDays.toString() + " day";
        if (timeDifferenceDays > 1.01) { // plural needed...
            differenceString += "s"
        }
        differenceString += ", ";
        absTimeDifference -= timeDifferenceDays*(24*60*60*1000.0);
    }
    timeDifferenceHours = Math.floor(absTimeDifference/(60*60*1000.0));
    if (timeDifferenceHours > tolerance) {
        differenceString += timeDifferenceHours.toString() + " hour";
        if (timeDifferenceHours > 1.01) {
            differenceString += "s";
        }
        differenceString += ", ";
        absTimeDifference -= timeDifferenceHours*(60*60*1000.0);
    }
    timeDifferenceMinutes = Math.round(absTimeDifference/(60*1000.0));
    if (timeDifferenceMinutes > tolerance) {
        differenceString += timeDifferenceMinutes.toString() + " minute";
        if (timeDifferenceMinutes > 1.01) {
            differenceString += "s";
        }
        differenceString += ", ";
        absTimeDifference -= timeDifferenceMinutes*(60*1000.0);
    }
    return differenceString.substr(0, differenceString.length - 2); // to remove ", " at the end
}

function setTimeDifferenceWRTTimestamp(resultSpanID, currentTimestampSpanID, spanIDOfTimestampWRTWhichToGetTimeDifference) {
    var dateCurrent = new Date(parseInt(document.getElementById(currentTimestampSpanID).innerHTML));
    var dateWRTWhichToGetTimeDifference = new Date(parseInt(document.getElementById(spanIDOfTimestampWRTWhichToGetTimeDifference).innerHTML));
    var difference = dateCurrent - dateWRTWhichToGetTimeDifference;
    document.getElementById(resultSpanID).innerHTML = getTimeDifferenceReadable(difference);
}

function setAlarmFromTimestamp(targetElementID, currentTimestampSpanID, spanIDOfTimestampWRTWhichToGetTimeDifference, threshold) {
    var dateCurrent = new Date(parseInt(document.getElementById(currentTimestampSpanID).innerHTML));
    var dateWRTWhichToGetTimeDifference = new Date(parseInt(document.getElementById(spanIDOfTimestampWRTWhichToGetTimeDifference).innerHTML));
    var difference = dateCurrent - dateWRTWhichToGetTimeDifference;
    if (difference > threshold) {
        document.getElementById(targetElementID).style.color = "#cc0000";
    }
    else {
        document.getElementById(targetElementID).style.color = "#009933";
    }
}

function updateCurrentTimeInfo() {
    setCurrentTimeSpan("currentTimestampSpan");
    setTimeFromTimestamp("currentTimeSpan", "currentTimestampSpan");
    setTimeDifferenceWRTTimestamp("lastDailyBackupTimeDifferenceSpan", "currentTimestampSpan", "dailyLatestTimestampSpan");
    setTimeDifferenceWRTTimestamp("lastWeeklyBackupTimeDifferenceSpan", "currentTimestampSpan", "weeklyLatestTimestampSpan");
    setAlarmFromTimestamp("dailyBackupText", "currentTimestampSpan", "dailyLatestTimestampSpan", 1000*60*60*24);
    setAlarmFromTimestamp("weeklyBackupText", "currentTimestampSpan", "weeklyLatestTimestampSpan", 1000*60*60*24*7);
}

function refreshContents() {
    location.reload(true);
    setTimestampFromFile("dailyLatestTimestampSpan", "dailyLatestTimestampFrame");
    setTimestampFromFile("weeklyLatestTimestampSpan", "weeklyLatestTimestampFrame");
    setTimeFromTimestamp("lastDailyBackupTimeSpan", "dailyLatestTimestampSpan");
    setTimeFromTimestamp("lastWeeklyBackupTimeSpan", "weeklyLatestTimestampSpan");
    updateCurrentTimeInfo();
}

function toExecuteOnLoad() {
    updateCurrentTimeInfo();
    setInterval(refreshContents, 1000*60*60*2); // refresh info based on logged timestamps every two hours
    setInterval(updateCurrentTimeInfo, 1000*60*10); // refresh info based on current time every 10 minutes
}
