function saveNote() {
    var form = document.forms["note-form"];
    var selector = document.getElementById("importance");

    var note = {
        title: form.title.value,
        description: form.description.value,
        importance: selector[selector.selectedIndex].value,
        duedate: formatDate(form.duedate.value)
    }

    createOrUpdateNoteInLocalStorage(generateGuid(), note);
}

function loadNotes() {
    var context = {
        notes: getAllItemFromLocalStorage()
    };
    var source = document.getElementById("note-template").innerHTML;
    var template = Handlebars.compile(source);
    var htmlString = template(context);
    document.getElementById("note-panel").innerHTML = htmlString;
}

function complete(id) {
    var note = getItemFromLocalStorageByKey(id);
    note.dateCompleted = formatDate(Date.now());
    createOrUpdateNoteInLocalStorage(id, note);
    loadNotes();
}

function undone(id) {
    var note = getItemFromLocalStorageByKey(id);
    delete note.dateCompleted;
    createOrUpdateNoteInLocalStorage(id, note);
    loadNotes();
}

function createOrUpdateNoteInLocalStorage(key, note) {
    if (LocalStorageAvailable()) {
        localStorage.setItem(key, JSON.stringify(note));
    }
}

function getItemFromLocalStorageByKey(key) {
    if (LocalStorageAvailable()) {
        return JSON.parse(localStorage.getItem(key));
    }
    return null;
}

function getAllItemFromLocalStorage() {
    if (LocalStorageAvailable()) {
        var allItems = [];
        var keys = Object.keys(localStorage);

        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var item = JSON.parse(localStorage.getItem(key));
            item.id = key;
            allItems.push(item);
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
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    loadNotes();
}

function formatDate(dateString) {
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