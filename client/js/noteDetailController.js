﻿import { getUrlParameter } from "./Shared.js"
import { NotesGenerator } from "./NotesGenerator.js";
import { NoteLocalStorage } from "./NoteLocalStorage.js";


export class NoteDetailController {

    constructor(model, view) {
        this._model = model;
        this._view = view;

        this._model.addObserver(this._view);

        this._dom = this._view.getDOM();
        this.registerHandlerOnDomElements();

        let id = getUrlParameter("id");
        this._model.getNoteById(id);
        this.generator = new NotesGenerator(new NoteLocalStorage);
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
            this._model.save(id, note);
            this._view.showNotification(`Note "${note.title}" successfully saved!`);
        }
    }

    generateNotes() {

        let amount = this._dom.noteAmount.value;

        this.generator.generateRandomNotes(amount);
        this._view.showNotification(`${amount} note(s) successfully generated and saved!`);
    }
}