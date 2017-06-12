import { Observable } from "./Observable.js";

export class NoteModel extends Observable {

    constructor(storage) {
        super();
        this._storage = storage;
    }

    setFilterAndSortingParameter(sortCriteria, includingCompleted) {
        this.sortCriteria = sortCriteria;
        this.includingCompleted = includingCompleted;
    }

    sortAndFilter() {
        // todo chain function calls;
        this.notes = this._storage.getAllItemFromLocalStorageIncludingId();
        this.sort();
        this.filter();
        this.notifyObservers();
    }

    getNoteById(id) {
        this.note = this._storage.getItemFromLocalStorageByKey(id) || {};
        this.note.id = id;
        this.notifyObservers();
    }

    save(id, note) {
        this._storage.save(id, note);
        this.note = {};
        this.notifyObservers();
    }

    complete(id) {
        let note = this._storage.getItemFromLocalStorageByKey(id);
        note.completed = true;
        note.completionDate = Date.now();
        this._storage.createOrUpdateNoteInLocalStorage(id, note);
        this.sortAndFilter();
    }

    undone(id) {
        let note = this._storage.getItemFromLocalStorageByKey(id);
        note.completed = false;
        note.completionDate = null;
        this._storage.createOrUpdateNoteInLocalStorage(id, note);
        this.sortAndFilter();
    }

    filter() {
        if (!this.includingCompleted) {
            this.notes = this.notes.filter(x => !x.completed);
        }
    }

    sort() {
        switch (+this.sortCriteria) {
            case 1:
                this.sortByDate("dueDate");
                break;
            case 2:
                this.sortByDate("completionDate");
                break;
            case 3:
                this.sortByDate("creationDate");
                break;
            case 4:
                this.sortByValue("importance");
                break;
        }
    }

    sortByDate(property) {
        this.notes
            .sort(function (a, b) {
                return new Date(a[property]) - new Date(b[property]);
            });
    }

    sortByValue(property) {
        this.notes
            .sort(function (a, b) {
                return a[property] - b[property];
            });
    }

    validate(note) {
        let modelvalidationResult = {
            isModelValid: true
        }

        if (!note.title) {
            modelvalidationResult.isModelValid = false;
            modelvalidationResult.titleMsg = "Please set a title";
        }

        if (note.title.length > 60) {
            modelvalidationResult.isModelValid = false;
            modelvalidationResult.titleLengthMsg = "Title must not contain more than 60 characters";
        }

        if (!note.description) {
            modelvalidationResult.isModelValid = false;
            modelvalidationResult.descriptionMsg = "Please set a description";
        }

        if (!note.dueDate) {
            modelvalidationResult.isModelValid = false;
            modelvalidationResult.dueDateMsg = "Please set a valid date";
        }

        return modelvalidationResult;
    }
}