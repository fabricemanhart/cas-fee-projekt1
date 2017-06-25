const store = require("../services/noteService.js");

module.exports.save = function (req, res) {
    store.save(req.body,
        function (err, newNote) {
            res.statusCode = 201;
            res.json(newNote);
        });
}

module.exports.update = function (req, res) {
    store.update(req.params.id, req.body,
        function (err, newNote) {
            res.json(newNote);
        });
}

module.exports.getById = function (req, res) {
    store.getById(req.params.id,
        function (err, note) {
            res.json(note);
        });
}

module.exports.getAll = function (req, res) {
    store.getAll(function (err, notes) {
            res.json(notes);
        });
}