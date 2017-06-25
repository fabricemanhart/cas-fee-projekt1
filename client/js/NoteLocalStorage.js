import { generateGuid } from "./Shared.js"

export class NoteLocalStorage {

    save(id, note) {
        if (!id) {
            id = generateGuid();
        }
        this.createOrUpdateNoteInLocalStorage(id, note);
    }

    createOrUpdateNoteInLocalStorage(key, note) {
        if (this.localStorageAvailable()) {
            localStorage.setItem(key, JSON.stringify(note));
        }
    }

    getItemFromLocalStorageByKey(key) {
        if (this.localStorageAvailable()) {
            let note = JSON.parse(localStorage.getItem(key));
            return note;
        }
        return null;
    }

    getAllItemFromLocalStorageIncludingId() {
        if (this.localStorageAvailable()) {
            let allItems = [];

            let keys = Object.keys(localStorage);

            for (let i = 0, len = keys.length; i < len; i++) {
                let key = keys[i];
                let note = this.getItemFromLocalStorageByKey(key);
                note.id = key;
                allItems.push(note);
            }
            return allItems;
        }
        return null;
    }

    localStorageAvailable() {
        if (typeof (Storage) !== "undefined") {
            return true;
        } else {
            alert("Your browser does not support local storage.");
            return false;
        }
    }
}