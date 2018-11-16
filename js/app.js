'use strict';

    const e = React.createElement;
    var i = '';

    // Client ID and API key from the Developer Console
    var CLIENT_ID = '1000202189913-1pe9f9ukvigmnvggq59gf58fso9feh8j.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyDle6atFe6XOJQ3xJRd2oE5yQbqqhXrpCg';

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest", "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest", "https://sheets.googleapis.com/$discovery/rest?version=v4"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/tasks.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/spreadsheets.readonly";


    var authorizeButton = document.getElementById('authorize_button');
    var signoutButton = document.getElementById('signout_button');

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    function handleClientLoad() {
      gapi.load('client:auth2', initClient);
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
      });
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
      if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
        listGroceries();
        displayCalendar();
        // loadCalendarDays();
        // loadYears();
        //listTaskLists();
        viewTasks();
      } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
      }
    }

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    function listUpcomingEvents() {
      gapi.client.calendar.events.list({
        'calendarId': 'l31k4tuaqbn7t65m4krvva1gao@group.calendar.google.com',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 7,
        'orderBy': 'startTime'
      }).then(function(response) {
        var events = response.result.items;

        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            var event = events[i];
            var when = event.start.dateTime;
            var location = event.location = (event.location == undefined) ? '' : 'at ' + event.location;
            var options = { weekday: 'short', month: 'short', day: 'numeric',  hour: 'numeric', minute: 'numeric' };
            var compareOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            var when = new Date(when);
            var today = new Date();
            var compareDateToday = today.toLocaleDateString("en-US", compareOptions);
            var compareDateEvent = when.toLocaleDateString("en-US", compareOptions);
            console.log(today.toLocaleDateString("en-US", compareOptions));
            //var liElement = document.createElement('li'),
            //var eventListItem = event.summary + ' (' + when + ') ' + location;
            //liElement.appendChild(document.createTextNode(taskItem));
            //document.getElementById("taskList").appendChild(liElement);
            if (!when) {
              when = event.start.date;
              when = new Date(when);
            }
            const divEventWrap = document.createElement('div');

            if ((i + 7) == (events.length)) {
              divEventWrap.classList.add("cell", "small-16", "next-event");
            } else {
              divEventWrap.classList.add("cell", "small-6");
            }
            var eventItem = event.summary + ' (' + when.toLocaleDateString("en-US", options) + ') ' + location;
            divEventWrap.appendChild(document.createTextNode(eventItem));
            document.getElementById("eventList").appendChild(divEventWrap);




          }
        } else {
          appendPre('No upcoming events found.');
        }
      });
    }

    function getCalendar() {
      gapi.client.calendar.calendarList.list({
        'maxResults': 10
      }).then(function(response) {
        var calendars = response.result.items;
        appendPre('Calendars:');

        if (calendars.length > 0) {
          for (i = 0; i < calendars.length; i++) {
            var calendar = calendars[i];
            console.log(calendar.summary + ' - ID: ' + calendar.id);
          }
        } else {
          appendPre('No upcoming events found.');
        }
      });
    }

    function displayCalendar() {
      gapi.client.calendar.calendars.get({
        'calendarId': 'l31k4tuaqbn7t65m4krvva1gao@group.calendar.google.com'
      }).then(function(response) {
        console.log(response);
      });
    }


    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
    }

    /**
     * Append a pre element to the body containing the given message
     * as its text node. Used to display the results of the API call.
     *
     * @param {string} message Text to be placed in pre element.
     */
    function appendPre(message) {
      var pre = document.getElementById('content');
      var textContent = document.createTextNode(message + '\n');
      pre.appendChild(textContent);
    }

    /**
     * Print task lists.
     */
    function listTaskLists() {
      gapi.client.tasks.tasklists.list({
          'maxResults': 10
      }).then(function(response) {
        appendPre('Task Lists:');
        var taskLists = response.result.items;
        if (taskLists && taskLists.length > 0) {
          for (var i = 0; i < taskLists.length; i++) {
            var taskList = taskLists[i];
            appendPre(taskList.title + ' (' + taskList.id + ') ');
          }
        } else {
          appendPre('No task lists found.');
        }
      });
    }

    function viewTasks() {
      gapi.client.tasks.tasks.list({'tasklist' : 'MDY0OTkzMTE4ODgwMTIyNTQyNjE6NTU1MDI0MzUwNTIyMzUyNTow'}).then(function(response){
          var list = response.result.items;
          for(var i=0; i < list.length; i++) {
            document.createElement('br');
            var taskStatus = list[i].status,
            dueDate = list[i].due,
            noteField = list[i].notes = (list[i].notes == undefined) ? '' : list[i].notes,
            options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dueDate = new Date(dueDate);
            if (taskStatus != 'completed') {
              var liElement = document.createElement('li'),
              taskItem = list[i].title + ' ' + noteField + ' ' + dueDate.toLocaleDateString("en-US", options);
              liElement.appendChild(document.createTextNode(taskItem));
              document.getElementById("taskList").appendChild(liElement);
              //appendPre(list[i].title + ' ' + noteField + ' ' + dueDate.toLocaleDateString("en-US", options));
              //document.getElementById('taskList').innerHTML = '<li>' + list[i].title + ' ' + noteField + ' ' + dueDate.toLocaleDateString("en-US", options) + '</li>';
            }
          }
      });
    }


    /**
     * Creates a Sheets API service object and prints a list of
     * reminders
     * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     */
    function listGroceries() {
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '18NdRa6VBrUTcQ51Jmk9kodpP9j_ADO6xjwi-_-PvsFM',
        range: 'Sheet1!A1:E',
      }).then(function(response) {

        var range = response.result;
        if (range.values.length > 0) {
          for (i = 0; i < range.values.length; i++) {
            var row = range.values[i];
            var status = row[2];
            console.log(status);
            if (status != 'Completed') {
              var liElement = document.createElement('li'),
              groceryItem = row[1];
              liElement.appendChild(document.createTextNode(groceryItem));
              document.getElementById("groceryList").appendChild(liElement);
            }
            // Print column B
          }
        } else {
          appendPre('No data found.');
        }
      }, function(response) {
        appendPre('Error: ' + response.result.error.message);
      });

      function getDailyQuote() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var quoteJSON, i, j, x = "";
            quoteJSON = JSON.parse(this.response);
            //console.log('quote: ' + quoteJSON);
            for (i in quoteJSON.contents.quotes) {
                x += "<h1>" + quoteJSON.contents.quotes[i].author + "</h1>";
                for (j in quoteJSON.contents.quotes[i].quote) {
                    x += quoteJSON.contents.quotes[i].quote[j];
                }
            }
            //console.log(x);
            document.getElementById("quoteContainer").innerHTML = x;

          }
        };
        xhttp.open("GET", "https://quotes.rest/qod.json", true);
        xhttp.send();

        // var myObj, i, j, x = "";
        // myObj = {
        //     "name":"John",
        //     "age":30,
        //     "cars": [
        //         {"name":"Ford", "models":"Mustang"}
        //     ]
        // }
        // for (i in myObj.cars) {
        //     x += "<h2>" + myObj.cars[i].name + "</h2>";
        //     for (j in myObj.cars[i].models) {
        //         x += myObj.cars[i].models[j];
        //     }
        // }
        //
        // document.getElementById("demo").innerHTML = x;


      }

      getDailyQuote();

      // gapi.client.sheets.spreadsheets.values.get({
      //   spreadsheetId: '18NdRa6VBrUTcQ51Jmk9kodpP9j_ADO6xjwi-_-PvsFM',
      //   range: 'Sheet1!B1:B'
      // }).then((response) => {
      //   console.log(response);
      //   var result = response.result;
      //   var values = result.values;
      //   if (values) {
      //     console.log('Name, Major:');
      //     for (var row = 0; row < values.length; row++) {
      //       // Print columns A and E, which correspond to indices 0 and 4.
      //       console.log(' - %s, %s', values[row][1]);
      //     }
      //   } else {
      //       console.log('No data found.');
      //   }
      // });
    }



    // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // var startYear = 2000;
    // var endYear = 2020;
    // var month = 0;
    // var year = 0;
    //
    // function loadCalendarMonths() {
    //     for (var i = 0; i < months.length; i++) {
    //         var doc = document.createElement("div");
    //         doc.innerHTML = months[i];
    //         doc.classList.add("dropdown-item");
    //
    //         doc.onclick = (function () {
    //             var selectedMonth = i;
    //             return function () {
    //                 month = selectedMonth;
    //                 document.getElementById("curMonth").innerHTML = months[month];
    //                 loadCalendarDays();
    //                 return month;
    //             }
    //         })();
    //
    //         document.getElementById("months").appendChild(doc);
    //     }
    // }
    //
    // function loadCalendarYears() {
    //     document.getElementById("years").innerHTML = "";
    //
    //     for (var i = startYear; i <= endYear; i++) {
    //         var doc = document.createElement("div");
    //         doc.innerHTML = i;
    //         doc.classList.add("dropdown-item");
    //
    //         doc.onclick = (function () {
    //             var selectedYear = i;
    //             return function () {
    //                 year = selectedYear;
    //                 document.getElementById("curYear").innerHTML = year;
    //                 loadCalendarDays();
    //                 return year;
    //             }
    //         })();
    //
    //         document.getElementById("years").appendChild(doc);
    //     }
    // }
    //
    // function loadCalendarDays() {
    //     document.getElementById("calendarDays").innerHTML = "";
    //
    //     var tmpDate = new Date(year, month, 0);
    //     var num = daysInMonth(month, year);
    //     var dayofweek = tmpDate.getDay();       // find where to start calendar day of week
    //
    //     for (var i = 0; i <= dayofweek; i++) {
    //         var d = document.createElement("div");
    //         d.classList.add("day");
    //         d.classList.add("blank");
    //         document.getElementById("calendarDays").appendChild(d);
    //     }
    //
    //     for (var i = 0; i < num; i++) {
    //         var tmp = i + 1;
    //         var d = document.createElement("div");
    //         d.id = "calendarday_" + i;
    //         d.className = "day";
    //         d.innerHTML = tmp;
    //
    //         document.getElementById("calendarDays").appendChild(d);
    //     }
    //
    //     var clear = document.createElement("div");
    //     clear.className = "clear";
    //     document.getElementById("calendarDays").appendChild(clear);
    // }
    //
    // function daysInMonth(month, year)
    // {
    //     var d = new Date(year, month+1, 0);
    //     return d.getDate();
    // }
    //
    // window.addEventListener('load', function () {
    //     var date = new Date();
    //     month = date.getMonth();
    //     year = date.getFullYear();
    //     document.getElementById("curMonth").innerHTML = months[month];
    //     document.getElementById("curYear").innerHTML = year;
    //     loadCalendarMonths();
    //     loadCalendarYears();
    //     loadCalendarDays();
    // });

    class LikeButton extends React.Component {
      constructor(props) {
        super(props);
        this.state = { liked: false };
      }

      render() {
        if (this.state.liked) {
          return 'You liked this.';
        }

        return e(
          'button',
          { onClick: () => this.setState({ liked: true }) },
          'Like'
        );
      }
    }
