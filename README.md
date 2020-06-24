# LastLesson for WebUntis
This is a small Node.js/AppleScript script to get the last lessons of a school week (daily) in the macOS Calendar as an entry.

## Installation and Setup
1. Clone this repository and install 'webuntis' and 'node-osascript' via npm or yarn.
2. Open 'app.js' and change the macOS Calendar (macOSCalendarName) name to the correct calendar for you.
3. Provide school, username, password and server for your school/user account at WebUntis.

## Run and Use LastLesson for WebUntis
After you finished the installation and setup process, you can now start using LastLesson for WebUntis.
LastLesson for WebUntis is designed to create an entry for each day starting from Monday:

```
node app.js "2020-06-29"
```

Please note that the day of the date must be a Monday.

## Note
I wrote this script on a rainy day to get this running/working quickly. There might be issues and bugs.
Feel free to fork this repository and create pull requests - I'll gladly accept them.