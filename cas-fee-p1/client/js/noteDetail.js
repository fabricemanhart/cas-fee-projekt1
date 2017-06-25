import { NoteDetailView } from "./noteDetailView.js";
import { NoteModel } from "./noteModel.js";
// import { NoteLocalStorage } from "./noteLocalStorage.js";
import { NoteDetailController } from "./noteDetailController.js";
import { NoteService } from "./noteService.js";
    
// let storage = new NoteLocalStorage();
let storage = new NoteService();
let model = new NoteModel(storage);
let view = new NoteDetailView(model);
let ctrl = new NoteDetailController(model, view);