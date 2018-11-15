
  // Client ID and API key from the Developer Console
  var CLIENT_ID = '1043118083700-aurk71dd7ne3o22nh0fs4rqmtgu0ma5a.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyC2qgLkM4tJCH3PnnQnvkj8tnd1DZlw0hw';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest", "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/tasks.readonly https://www.googleapis.com/auth/calendar.readonly";


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
      // displayCalendar();
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
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      console.log(response);
      var events = response.result.items;
      appendPre('Upcoming events:');

      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          var location = event.location = (event.location == undefined) ? '' : 'at ' + event.location;
          if (!when) {
            when = event.start.date;
          }
          appendPre(event.summary + ' (' + when + ') ' + location);
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
          appendPre(calendar.summary + ' - ID: ' + calendar.id);
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
