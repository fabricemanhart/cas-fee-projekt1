import { NoteMainView } from "./NoteMainView.js";
import { NoteModel } from "./NoteModel.js";
import { NoteLocalStorage } from "./NoteLocalStorage.js";
import { NoteMainController } from "./NoteMainController.js";

let storage = new NoteLocalStorage();
let model = new NoteModel(storage);
let view = new NoteMainView(model);
let ctrl = new NoteMainController(model, view);