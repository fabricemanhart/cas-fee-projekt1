import { getUrlParameter } from "./shared.js"
import { NotesGenerator } from "./notesGenerator.js";

export class NoteDetailController {

    constructor(model, view) {
        this._model = model;
        this._view = view;

        this._model.addObserver(this._view);

        this._dom = this._view.getDOM();
        this.registerHandlerOnDomElements();

        let id = getUrlParameter("id");
        if (id) {
            this._model.getNoteById(id);
        }

        this.generator = new NotesGenerator();
    }

    registerHandlerOnDomElements() {
        this._dom.saveButton.addEventListener("click", this.save.bind(this));
        this._dom.generatorButton.addEventListener("click", this.generateNotes.bind(this));
    }

    save() {
        let note = this._view.getNoteInput();
        let validationResult = this._model.validate(note);

        if (!validationResult.isModelValid) {
            this._view.showValidationErrors(validationResult);
        } else {
            let id = this._view.getNoteId();
            this._model
                .saveOrUpdate(id, note)
                .then(this.showNotification.bind(this));
        }
    }

    generateNotes() {
        let amount = this._dom.noteAmount.value;
        let notes = this.generator.generateRandomNotes(amount);

        for (let i = 0, len = notes.length; i < len; i++) {
            this._model
                .saveOrUpdate(notes[i])
                .then(this.showNotification.bind(this));
        }   

        this._view.showNotification(`${amount} note(s) successfully generated and saved!`);
    }

    showNotification() {
        this._view.showNotification(`Note successfully saved!`);
    }
}