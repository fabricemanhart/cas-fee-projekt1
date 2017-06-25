import { formatDate } from "./shared.js"

const dom = {
    completeButtons: document.getElementsByClassName("js-complete-btn"),
    undoneButtons: document.getElementsByClassName("js-undone-btn"),
    includingCompletedCheckBox: () => document.getElementById("includingCompleted"),
    sortCriteriaDropDown: () => document.getElementById("sorting")
}

export class NoteMainView {

    constructor(model) {
        this._model = model;
        this.registerHandlebarHelpers();
    }

    getDOM() {
        return dom;
    }

    update() {
        this.notes = this._model.notes;
        this.renderNotesList();
        this.renderActionBar(dom.sortCriteriaDropDown().value, dom.includingCompletedCheckBox().checked);
    }

    renderNotesList() {
        // Format Dates Moment.js???
        for (let i = 0, len = this.notes.length; i < len; i++) {
            this.notes[i].creationDate = formatDate(this.notes[i].creationDate);
            this.notes[i].dueDate = formatDate(this.notes[i].dueDate);
            this.notes[i].completionDate = formatDate(this.notes[i].completionDate);
        }

        let context = {
            notes: this.notes
        };

        let noteTemplate = document.getElementById("note-template").innerHTML;
        let template = Handlebars.compile(noteTemplate);
        let htmlString = template(context);

        document.getElementById("note-list").innerHTML = htmlString;
    }

    renderActionBar(sorting, includingCompleted) {
        let context = {
            notesTotal: this.notes ? this.notes.length : 0,
            notesCompleted: this.notes ? this.notes.filter(x => x.completionDate).length : 0,
            sorting: sorting,
            includingCompleted: includingCompleted
        };

        let actionbarTemplate = document.getElementById("actionbar-template").innerHTML;
        let template = Handlebars.compile(actionbarTemplate);
        let htmlString = template(context);

        document.getElementById("action-bar").innerHTML = htmlString;
    }

    registerHandlebarHelpers() {

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
}