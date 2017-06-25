export class NoteMainController {

    constructor(model, view) {
        this._model = model;
        this._view = view;

        this._model.addObserver(this._view);
        this._model.addObserver(this);

        // Start
        this._view.renderActionBar(1, true);
        this.setFilterAndSortingParameter();
        this.sortAndFilterNotes();
    }

    update() {
        this.registerHandlerOnDomElements();
    }

    registerHandlerOnDomElements() {

        let dom = this._view.getDOM();

        for (let i = 0, len = dom.completeButtons.length; i < len; i++) {
            dom.completeButtons[i].addEventListener("click", this.completeNote.bind(this));
            dom.completeButtons[i].addEventListener("click", this.setFilterAndSortingParameter.bind(this));
        }

        for (let i = 0, len = dom.undoneButtons.length; i < len; i++) {
            dom.undoneButtons[i].addEventListener("click", this.undoneNote.bind(this));
            dom.undoneButtons[i].addEventListener("click", this.setFilterAndSortingParameter.bind(this));
        }

        dom.includingCompletedCheckBox().addEventListener("change", this.setFilterAndSortingParameter.bind(this));
        dom.includingCompletedCheckBox().addEventListener("change", this.sortAndFilterNotes.bind(this));
        dom.sortCriteriaDropDown().addEventListener("change", this.setFilterAndSortingParameter.bind(this));
        dom.sortCriteriaDropDown().addEventListener("change", this.sortAndFilterNotes.bind(this));
    }

    setFilterAndSortingParameter() {
        let dom = this._view.getDOM();
        this._model.setFilterAndSortingParameter(dom.sortCriteriaDropDown().value, dom.includingCompletedCheckBox().checked);
      // TODO EEFI
    }

    completeNote(event) {
        let id = event.currentTarget.dataset["noteId"];
        this._model.complete(id);
    }

    undoneNote(event) {
        let id = event.currentTarget.dataset["noteId"];
        this._model.undone(id);
    }

    sortAndFilterNotes() {

        this._model.sortAndFilter();
    }
}