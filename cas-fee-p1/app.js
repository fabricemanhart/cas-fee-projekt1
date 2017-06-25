const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/notes", require("./routes/noteRoutes.js"));
app.use(express.static(__dirname + "/client"));
app.use(notFound);
app.use(errorHandler);

const hostname = "127.0.0.1";
const port = 3001;
app.listen(port, hostname, () => { console.log(`Server running at http://${hostname}:${port}/`); });


function notFound(req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.send(404, "Page not found! ");
}

function errorHandler(err, req, res, next) {
    res.status(500).end(err.message);
}