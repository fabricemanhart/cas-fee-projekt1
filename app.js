function saveNote() {

    var id = document.getElementById("id").value;
    var selector = document.getElementById("importance");

    var note = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        importance: selector[selector.selectedIndex].value,
        dueDate: document.getElementById("duedate").value,
        creationDate: Date.now() // or update date
    }

    if (!id) {

        id = generateGuid();
    }
    createOrUpdateNoteInLocalStorage(id, note);
    showNotification(note.title);
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

    document.getElementById("main-title").innerText = text;
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

    if (includingCompleted) {
        loadNotes(sortedNotes, includingCompleted, sortCriteria);
    } else loadNotes(sortedNotes.filter(x => !x.dateCompleted), includingCompleted, sortCriteria);
}

function sortByDate(property) {
    return getAllItemFromLocalStorageIncludingId()
        .sort(function (a, b) {
            //var aParsed = Date.parse(a[property]);
            //var bParsed = Date.parse(b[property]);
            //if (aParsed < bParsed) return -1;
            //if (aParsed > bParsed) return 1;
            //return 0;
            if (a[property] < b[property]) return -1;
            if (a[property] > b[property]) return 1;
            return 0;
        });
}

function sortByValue(property) {
    return getAllItemFromLocalStorageIncludingId()
        .sort(function (a, b) {
            return a[property] - b[property];
        });
}

function loadNotes(notes, includingCompleted, sorting) {

    for (var i = 0, len = notes.length; i < len; i++) {
        notes[i].creationDate = formatDate(notes[i].creationDate);
        notes[i].dueDate = formatDate(notes[i].dueDate);
        notes[i].dateCompleted = formatDate(notes[i].dateCompleted);
    }

    var context = {
        notes: notes,
        notesTotal: notes.length,
        notesCompleted: notes.filter(x => x.dateCompleted).length,
        sorting: sorting,
        includingCompleted: includingCompleted
    };
    var source = document.getElementById("note-template").innerHTML;
    var template = Handlebars.compile(source);
    var htmlString = template(context);
    document.getElementById("note-panel").innerHTML = htmlString;
}

function complete(id) {
    var note = getItemFromLocalStorageByKey(id);
    note.dateCompleted = Date.now();
    createOrUpdateNoteInLocalStorage(id, note);
    sortAndFilter();
}

function undone(id) {
    var note = getItemFromLocalStorageByKey(id);
    delete note.dateCompleted;
    createOrUpdateNoteInLocalStorage(id, note);
    sortAndFilter();
}

function createOrUpdateNoteInLocalStorage(key, note) {
    if (LocalStorageAvailable()) {
        localStorage.setItem(key, JSON.stringify(note));
    }
}

function getItemFromLocalStorageByKey(key) {
    if (LocalStorageAvailable()) {
        var note = JSON.parse(localStorage.getItem(key));
        return note;
    }
    return null;
}

function getAllItemFromLocalStorageIncludingId() {
    if (LocalStorageAvailable()) {
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

function LocalStorageAvailable() {
    if (typeof (Storage) !== "undefined") {
        return true;
    }
    else {
        alert("Your browser does not support local storage.");
        return false;
    }
}

function listNotes() {

    Handlebars.registerHelper('ifLowerEq', function (v1, v2, options) {
        if (v1 < v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('ifEq', function (v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    loadNotes(getAllItemFromLocalStorageIncludingId(), true);
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