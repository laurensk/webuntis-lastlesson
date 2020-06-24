const WebUntis = require('webuntis');
const osascript = require('node-osascript');

const macOSCalendarName = "Calendar";

const untis = new WebUntis(
    'school',
    'username',
    'password',
    'servername.webuntis.com'
);

var dateArg = process.argv.slice(2);
var firstDate = new Date(dateArg[0]);
var lastDate = new Date(new Date().setDate(firstDate.getDate() + 4));

untis
    .login()
    .then(() => {
        return untis.getOwnTimetableForRange(firstDate, lastDate);
    })
    .then(timetable => {

        timetable.sort((a, b) => a.date - b.date);

        var days = [];

        var currentDay = [];
        var currentDate = timetable[0].date;
        var dayIndex = 0;

        timetable.forEach(function (lesson) {

            if (lesson.date != currentDate) {

                currentDay.sort((a, b) => a.startTime - b.startTime);
                days[dayIndex] = currentDay;
                currentDay = [];
                dayIndex += 1;
                currentDate = lesson.date;

                currentDay.push(lesson);

            } else {
                currentDay.push(lesson);
            }

        });

        currentDay.sort((a, b) => a.startTime - b.startTime);
        days[dayIndex] = currentDay;


        var weekDays = [];

        days.forEach(function (lessons) {

            var highestEndTime = 0;

            lessons.forEach(function (lesson) {
                if (lesson.endTime >= highestEndTime) {
                    highestEndTime = lesson.endTime;
                }
            });

            weekDays.push(highestEndTime);

        });


        console.log("\n\n");
        for (var i = 0; i < 5; i++) {

            var today = new Date(new Date().setDate(firstDate.getDate() + i));
            var endTime = weekDays[i].toString();
            var endH = endTime.substring(0, 2);
            var endM = endTime.substring(2, 4);

            console.log(`Your last lesson on ${today.toLocaleDateString('en-EN', { weekday: 'long'})} ends at ${endH}:${endM}.`);

            var eventCommand = `
            Tell application "Calendar"
            activate
            tell calendar "${macOSCalendarName}"
                set eventDate to (current date)
                set day of eventDate to ${today.getDate()}
                set month of eventDate to ${today.getMonth()+1}
                set year of eventDate to ${today.getFullYear()}
                set hours of eventDate to 7
                set minutes of eventDate to 30
                make new event at end with properties {description:"This event has been generated automatically by LastLesson for Untis (https://github.com/laurensk/webuntis-lastlesson).", summary:"Last lesson ends at ${endH}:${endM}", location:"LastLesson for Untis", start date:eventDate, end date:eventDate}
            end tell
            reload calendars
            end tell`;

            osascript.execute(eventCommand, function (err, result, raw) {
                if (err) return console.error(err);
            });



        }
        console.log("\n\n");

    });