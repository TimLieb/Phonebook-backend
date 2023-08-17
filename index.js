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

app.get("/api/persons", (request, response, next) => {
    person
        .find({})
        .then((result) => response.json(result))
        .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
    person
        .findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
    const body = request.body;

    if (body.name === undefined) {
        return response.status(400).json({ error: "content missing" });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson);
        })
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
    person
        .find({})
        .then((savedPersons) =>
            response.send(
                `<p>Phonebook has info for ${
                    savedPersons.length
                } people</p><p>${new Date().toLocaleString()}</p>`
            )
        )
        .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    return response.status(400).send({ error: "an unexpected error occured" });

    next(error);
};

app.use(errorHandler);
