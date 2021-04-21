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
    console.log("HELLOOOOOO")
    Workout.aggregate([{
        $addFields: {
            totalWeight: {
                $sum: "$exercises.weight"
            },
            totalDuration: {
                $sum: "$exercises.duration"
            },
            totalDistance: {
                $sum: "$exercises.distance"
            }
        },


    }]).then(workoutData => {
        console.log(workoutData)
        res.json(workoutData)
    })
    // res.send("hello")
    // Workout.find({}, (error, data) => {
    //     if (error) {
    //         res.send(error);
    //     } else {
    //         console.log(data);
    //         res.json(data);
    //     }
    // })
});

app.get("/api/workouts/range", (req, res) => {
    Workout
        .aggregate([{
            $addFields: {
                totalWeight: {
                    $sum: "$exercises.weight"
                },
                totalDuration: {
                    $sum: "$exercises.duration"
                },
                totalDistance: {
                    $sum: "$exercises.distance"
                }
            },


        }])
        .limit(7)
        .then(workout => {
            console.log(workout)
            res.json(workout)
        })
        .catch(e => console.error(e))
    console.log(req.body);
});

app.put("/api/workouts/:id", (req, res) => {
    console.log(req.body)
    console.log(req.params.id)
    Workout.findByIdAndUpdate(req.params.id, { $push: { exercises: req.body } }, { new: true, runValidators: true })
        .then(() => res.sendStatus(200))
        .catch(e => console.error(e))
});

var PORT = process.env.PORT || 3001;

app.listen(PORT, function () {

});