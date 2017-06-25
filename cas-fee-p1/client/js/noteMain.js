import { NoteMainView } from "./noteMainView.js";
import { NoteModel } from "./noteModel.js";
// import { NoteLocalStorage } from "./noteLocalStorage.js";
import { NoteService } from "./noteService.js";
import { NoteMainController } from "./noteMainController.js";

// let storage = new NoteLocalStorage();
let storage = new NoteService();
let model = new NoteModel(storage);
let view = new NoteMainView(model);
let ctrl = new NoteMainController(model, view);