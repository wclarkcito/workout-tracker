const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const Workout = require("./models/workouts");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "exercise.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "stats.html"));
});

app.post("/api/workouts", ({ body }, res) => {
    Workout.create({ day: new Date() })
        .then((data) => {
            console.log(data);
            res.json(data)
        }).catch(e => console.error(e))
});

app.get("/api/workouts", (req, res) => {
    Workout.find({}, (error, data) => {
        if (error) {
            res.send(error);
        } else {
            console.log(data);
            res.json(data);
        }
    })
});

app.get("/api/workouts/range", (req, res) => {
    Workout.find().limit(7)
        .then(workout => res.json(workout))
        .catch(e => console.error(e))
    console.log(req.body);
});

app.put("/api/workouts/:id", (req, res) => {
    console.log(req.body)
    Workout.findByIdAndUpdate(req.params.id, { $push: { exercise: req.body } }, { new: true, runValidators: true })
        .then(() => res.sendStatus(200))
        .catch(e => console.error(e))
});


app.listen(3000, () => {
    console.log("App running on port 3000!");
});