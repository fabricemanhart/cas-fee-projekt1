import { formatDate } from "./Shared.js"


const dom = {
    saveButton: document.getElementById("save-button"),
    generatorButton: document.getElementById("generator-button"),
    noteAmountButton: document.getElementById("note-amount")
}

export class NoteDetailView {

    constructor(model) {
        this._model = model;
        this.registerNotesGeneratorAmountHandler();
    }

    getDOM() {
        return dom;
    }

    update() {
        this.note = this._model.note;
        this.populateNote();
        this.setTitleAndButtonText();
    }

    populateNote() {
        document.getElementById("note-id").value = this.note.id || "";
        document.getElementById("title").value = this.note.title || "";
        document.getElementById("description").value = this.note.description || "";
        document.getElementById("importance").value = this.note.importance || "0";
        document.getElementById("duedate").value = this.note.dueDate || "";
    }

    setTitleAndButtonText() {
        var text;
        if (this.note.id) {
            text = "Update Note";

        } else {
            text = "Create Note";
        }

        document.getElementById("page-title").innerText = text;
        document.getElementById("save-button").innerText = text;
    }

    getNoteId() {
        return document.getElementById("note-id").value;
    }

    getNoteInput() {
        let selector = document.getElementById("importance");
        return {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            importance: selector[selector.selectedIndex].value,
            completed: false,
            dueDate: document.getElementById("duedate").value,
            creationDate: Date.now(), // or update date
            completionDate: null
        }
    }

    showValidationErrors(validationResult) {

        this.hideAllValidationErrorMessages();

        if (validationResult.titleMsg) {
            document.getElementById("title-msg").textContent = validationResult.titleMsg;
            document.getElementById("title-msg").style.display = "block";
        }

        if (validationResult.titleLengthMsg) {
            document.getElementById("title-length-msg").textContent = validationResult.titleLengthMsg;
            document.getElementById("title-length-msg").style.display = "block";
        }

        if (validationResult.descriptionMsg) {
            document.getElementById("description-msg").textContent = validationResult.descriptionMsg;
            document.getElementById("description-msg").style.display = "block";
        }

        if (validationResult.dueDateMsg) {
            document.getElementById("duedate-msg").textContent = validationResult.dueDateMsg;
            document.getElementById("duedate-msg").style.display = "block";
        }
    }

    hideAllValidationErrorMessages() {
        let messages = document.getElementsByClassName("validation-message");

        for (var i = 0, len = messages.length; i < len; i++) {
            messages[i].style.display = "none";
        }
    }

    showNotification(title) {
        let alertArea = document.getElementById("save-alert-area");
        let alert = document.createElement("div");
        let text = document.createTextNode(`Note "${title}" successfully saved!`);

        alert.appendChild(text);
        alert.classList.add("save-alert");
        alert.classList.add("visible");
        alertArea.appendChild(alert);
        setTimeout(function () { alertArea.removeChild(alert); }, 3000);
    }

    registerNotesGeneratorAmountHandler() {
        dom.noteAmountButton.addEventListener("keyup", this.handleAmount.bind(this));
    }

    handleAmount(event) {
        let number = +event.currentTarget.value || 0;
        let buttonText = dom.generatorButton.text.split(' ');
        dom.generatorButton.text = `${buttonText[0]} ${buttonText[1]} (${number})`;
    }
} 