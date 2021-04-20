const API = {
    async getLastWorkout() {
        let res;
        try {
            res = await fetch("/api/workouts");
        } catch (err) {
            console.log(err)
        }
        const json = await res.json();

        return json[json.length - 1];
    },
    //not sending back json updating old response
    async addExercise(data) {
        const id = location.search.split("=")[1];

        const res = await fetch("/api/workouts/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        console.log(res)
        console.log("here")
        // let json = await res.json();
        // res.json().then(
        //     data => {
        //         json = data
        //     }
        // )
        // console.log(json)
        console.log("============")

        // return json;
        return res;
    },
    async createWorkout(data = {}) {
        const res = await fetch("/api/workouts", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        });

        const json = await res.json();
        console.log(json)
        return json;
    },

    async getWorkoutsInRange() {
        const res = await fetch(`/api/workouts/range`);
        const json = await res.json();

        return json;
    },
};
