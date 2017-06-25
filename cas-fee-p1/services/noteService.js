const Datastore = require('nedb');
const db = new Datastore({ filename: "./data/note.db", autoload: true });

function save(note, callback) {
    db.insert(note, function (err, newNote) {
        if (callback) {
            callback(err, newNote);
        }
    });
}

function update(id, note, callback) {
    db.update({ _id: id }, note, {}, function (err, note) {
        if (callback) {
            callback(err, note);
        }
    });
}

function getById(id, callback) {
    db.findOne({ _id: id }, function (err, note) {
        renameId(note);
        callback(err, note);
    });
}

function getAll(callback) {
    db.find({}, function (err, notes) {
        callback(err, notes.map(renameId));
    });
}

function renameId(note) {
    note.id = note._id;
    delete note._id;
    return note;
}

module.exports = { save: save, update: update, getById: getById, getAll: getAll };