import { generateGuid } from "./shared.js"

export class NoteLocalStorage {

    saveOrUpdate(id, note) {
        if (!id) {
            id = generateGuid();
        }
        this.update(id, note);
    }

    update(key, note) {
        if (this.localStorageAvailable()) {
            localStorage.setItem(key, JSON.stringify(note));
        }
    }

    getById(id) {
        if (this.localStorageAvailable()) {
            let note = JSON.parse(localStorage.getItem(id));
            return note;
        }
        return null;
    }

    getAll() {
        if (this.localStorageAvailable()) {
            let allItems = [];

            let keys = Object.keys(localStorage);

            for (let i = 0, len = keys.length; i < len; i++) {
                let key = keys[i];
                let note = this.getById(key);
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