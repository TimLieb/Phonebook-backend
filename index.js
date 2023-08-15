require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const person = require("./models/person");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("content", function (req, res) {
    return JSON.stringify(req.body);
});

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :content"
    )
);

app.get("/api/persons", (request, response) => {
    person.find({}).then((result) => response.json(result));
});

app.get("/api/persons/:id", (request, response) => {
    person.findById(request.params.id).then((person) => {
        response.json(person);
    });
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (body.name === undefined) {
        return response.status(400).json({ error: "content missing" });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then((savedPerson) => {
        response.json(savedPerson);
    });
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    person = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

app.get("/info", (request, response) => {
    response.send(
        `<p>Phonebook has info for ${
            persons.length
        } people</p><p>${new Date().toLocaleString()}</p>`
    );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
