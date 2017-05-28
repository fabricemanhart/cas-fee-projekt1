function saveNote() {

    var id = document.getElementById("id").value;
    var selector = document.getElementById("importance");

    var note = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        importance: selector[selector.selectedIndex].value,
        completed: false,
        dueDate: document.getElementById("duedate").value,
        creationDate: Date.now(), // or update date
        completionDate: null
    }

    if (!id) {

        id = generateGuid();
    }

    if (validateFields(note)) {
        createOrUpdateNoteInLocalStorage(id, note);
        showNotification(note.title);
    }
}

function validateFields(note) {

    var isFormValid = true;

    var messages = document.getElementsByClassName("validation-message");

    for (var i = 0, len = messages.length; i < len; i++) {
        messages[i].style.display = "none";
    }

    if (!note.title) {
        document.getElementById("title-msg").style.display = "block";
        isFormValid = false;
    }

  if (note.title.length > 60) {
    document.getElementById("title-length-msg").style.display = "block";
    isFormValid = false;
  }

    if (!note.description) {
        document.getElementById("description-msg").style.display = "block";
        isFormValid = false;

    }

    if (!note.dueDate) {
        document.getElementById("duedate-msg").style.display = "block";
        isFormValid = false;

    }

    if (isFormValid) {
        return true;
    }

    return false;
}

function showNotification(title) {
    var alertArea = document.getElementById("save-alert-area");
    var alert = document.createElement("div");
    var text = document.createTextNode(`Note "${title}" successfully saved!`);

    alert.appendChild(text);
    alert.classList.add("save-alert");
    alert.classList.add("visible");
    alertArea.appendChild(alert);
    setTimeout(function () { alertArea.removeChild(alert); }, 3000);
}

function populateNote(id) {

    if (!id) {
        return;
    }

    var note = getItemFromLocalStorageByKey(id);
    document.getElementById("id").value = id;
    document.getElementById("title").value = note.title;
    document.getElementById("description").value = note.description;
    document.getElementById("importance").value = note.importance;
    document.getElementById("duedate").value = note.dueDate;
}


function setTitleAndButtonText(id) {

    var text;
    if (id) {
        text = "Update Note";

    } else {
        text = "Create Note";

    }

    document.getElementById("page-title").innerText = text;
    document.getElementById("save-button").innerText = text;
}

function sortAndFilter() {
    var includingCompleted = document.getElementById("includingCompleted").checked;
    var sortCriteria = document.getElementById("sorting").value;
    var sortedNotes;

    switch (+sortCriteria) {
        case 1:
            sortedNotes = sortByDate("dueDate");
            break;
        case 2:
            sortedNotes = sortByDate("completionDate");
            break;
        case 3:
            sortedNotes = sortByDate("creationDate");
            break;
        case 4:
            sortedNotes = sortByValue("importance");
            break;

        default:
            sortedNotes = getAllItemFromLocalStorageIncludingId();
    }

    loadActionBar(sortedNotes, includingCompleted, sortCriteria);

    if (includingCompleted) {
        loadNotes(sortedNotes);
    } else loadNotes(sortedNotes.filter(x => !x.completed));
}

function sortByDate(property) {
    return getAllItemFromLocalStorageIncludingId()
        .sort(function (a, b) {
        return new Date(a[property]) - new Date(b[property]);
        //if (new Date(a[property]) < new Date(b[property])) return -1;
        //if (new Date(a[property]) > new Date(b[property])) return 1;
        //return 0;
      });
}

function sortByValue(property) {
    return getAllItemFromLocalStorageIncludingId()
        .sort(function (a, b) {
            return a[property] - b[property];
        });
}

function loadNotes(notes) {

    // Format Dates
    for (var i = 0, len = notes.length; i < len; i++) {
        notes[i].creationDate = formatDate(notes[i].creationDate);
        notes[i].dueDate = formatDate(notes[i].dueDate);
        notes[i].completionDate = formatDate(notes[i].completionDate);
    }

    var context = {
        notes: notes
    };

    var source = document.getElementById("note-template").innerHTML;
    var template = Handlebars.compile(source);
    var htmlString = template(context);
    document.getElementById("note-list").innerHTML = htmlString;
}

function loadActionBar(notes, includingCompleted, sorting) {

    var context = {
        notesTotal: notes ? notes.length : 0,
        notesCompleted: notes ? notes.filter(x => x.completionDate).length : 0,
        sorting: sorting,
        includingCompleted: includingCompleted
    };

    var source = document.getElementById("actionbar-template").innerHTML;
    var template = Handlebars.compile(source);
    var htmlString = template(context);
    document.getElementById("action-bar").innerHTML = htmlString;
}

function complete(id) {
    var note = getItemFromLocalStorageByKey(id);
    note.completed = true;
    note.completionDate = Date.now();
    createOrUpdateNoteInLocalStorage(id, note);
    sortAndFilter();
}

function undone(id) {
    var note = getItemFromLocalStorageByKey(id);
    note.completionDate = null;
    note.completed = false;
    createOrUpdateNoteInLocalStorage(id, note);
    sortAndFilter();
}

function createOrUpdateNoteInLocalStorage(key, note) {
    if (localStorageAvailable()) {
        localStorage.setItem(key, JSON.stringify(note));
    }
}

function getItemFromLocalStorageByKey(key) {
    if (localStorageAvailable()) {
        var note = JSON.parse(localStorage.getItem(key));
        return note;
    }
    return null;
}

function getAllItemFromLocalStorageIncludingId() {
    if (localStorageAvailable()) {
        var allItems = [];

        var keys = Object.keys(localStorage);

        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var note = getItemFromLocalStorageByKey(key);
            note.id = key;
            allItems.push(note);
        }
        return allItems;
    }
    return null;
}

function localStorageAvailable() {
    if (typeof (Storage) !== "undefined") {
        return true;
    }
    else {
        alert("Your browser does not support local storage.");
        return false;
    }
}

function registerHandlebarHelpers() {

    Handlebars.registerHelper("ifLowerEq", function (v1, v2, options) {
        if (v1 < v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper("ifEq", function (v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
}

function formatDate(dateString) {
    if (!dateString) {
        return null;
    }

    var date = new Date(dateString);
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('de-DE', options);
}

function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getUrlParameter(parameter) {
    var params = window.location.search.substr(1).split('&');

    for (var i = 0; i < params.length; i++) {
        var p = params[i].split('=');
        if (p[0] == parameter) {
            return decodeURIComponent(p[1]);
        }
    }
    return false;
}

function generateRandomNotes(amount) {

    for (var i = 0; i < amount; i++) {
        var note = {
            title: "Test Title",
            description: "Test text Test text Test text Test text Test text",
            importance: getRandomNumber(0, 5),
            dueDate: getRandomDate(2017, 2018).toISOString().slice(0, 10),
            creationDate: getRandomDate(2017, 2017),
            completionDate: null
        }

        if (isCompleted()) {
            note.completionDate = getRandomDate(2018, 2018);
            note.completed = true;
        }

        createOrUpdateNoteInLocalStorage(generateGuid(), note);
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isCompleted() {
    return !!getRandomNumber(0, 1);
}

function getRandomDate(minYear, maxYear) {
    var year = getRandomNumber(minYear, maxYear);
    var month = getRandomNumber(0, 11);
    var day = getRandomNumber(1, 31);

    return new Date(year, month, day);
}