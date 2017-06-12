import { NoteDetailView } from "./NoteDetailView.js";
import { NoteModel } from "./NoteModel.js";
import { NoteLocalStorage } from "./NoteLocalStorage.js";
import { NoteDetailController } from "./NoteDetailController.js";

let storage = new NoteLocalStorage();
let model = new NoteModel(storage);
let view = new NoteDetailView(model);
let ctrl = new NoteDetailController(model, view);