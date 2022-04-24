const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
let bodyParser = require("body-parser");
const mongoose = require("mongoose");
const res = require("express/lib/response");
//console.log(process.env.MONGO_URI,process.env.PORT)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const exerciseSchema = mongoose.Schema({
  // username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  // description:String,
  // duration: Number,
  date: String,
  //_id: false,
});
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  count: Number,
  log: [exerciseSchema],
});
const logSchema = mongoose.Schema({
  username: { type: String, required: true },
  count: Number,

  log: [
    {
      description: String,
      duration: Number,
      date: String,
    },
  ],
});
const Exercise = mongoose.model("Exercise", exerciseSchema);
const User = mongoose.model("user", userSchema);
const Log = mongoose.model("Log", logSchema);

//test

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.post(
  "/api/users",
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
    //enter ther username, submit and --- res.json({"username":"60018990","_id":"625accf6bd912806f3884f37"}), if username is empty,return error:( ValidationError: Users validation failed: username: Path `username` is required.)
    let username = req.body.username;
    async function doWork() {
      try {
        const dataExist = await User.findOne({ username: username });

        let resJson = {};
        if (dataExist !== null) {
          resJson["username"] = dataExist.username;
          resJson["_id"] = dataExist.id;
          res.json(resJson);

          console.log("username resJson--->", resJson);
        } else if (dataExist === null) {
          let newUser = new User({ username: username });
          //console.log("username----", newUser);
          const savedUser = await newUser.save();
          resJson["username"] = savedUser.username;
          resJson["_id"] = savedUser.id;
          //console.log(resJson);
          res.json(resJson);
        }
      } catch (error) {
        console.log("error--->", error);
      }
    }
    doWork();
  }
);

app.get("/api/users", (req, res) => {
  // retuen an array of all user
  User.find({}, (error, arrayOfUsers) => {
    if (!error) {
      res.json(arrayOfUsers);
    }
  });
});

app.post(
  "/api/users/:_id/exercises",
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
    let userId = req.params._id;
    let userDuration = parseInt(req.body.duration);
    let userDescription = req.body.description;
    let exerciseDate = req.body.date;
    console.log(req.body);
    //res.json({"_id":"625acdc3bd912806f3884f3a","username":"15172234","date":"Sat Apr 16 2022","duration":10,"description":"Green pass"})
    async function exercisesLog() {
      try {
        console.log("userId---", userId);
        const dataExist = await User.findById(userId);
        let resJson = {};
        console.log("dataExist--->", dataExist);
        if (dataExist !== null) {
          //data exist
          let event = exerciseDate !== "" ? new Date(exerciseDate) : new Date().toISOString().substring(0, 10);

          let newExercise = new Exercise({
            description: userDescription,
            duration: userDuration,
            date: event.toDateString(),
          });
          newExercise.save();
          console.log("req.body.date--->", req.body.date);

          // const savedExercise = await newExercise.save({})

          console.log("newExercise-->", newExercise);
          // resJson["date"] =event.toDateString() ;

          //delet Id key in newExercise
          delete newExercise._id;

          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { log: newExercise } },
            // {date: event.toDateString() },
            { new: true }
          );
          console.log("updatedUser--->", updatedUser);

          let resJson = {};
          resJson["_id"] = updatedUser.id;
          resJson["username"] = updatedUser.username;
          resJson["date"] = newExercise.date;
          resJson["duration"] = newExercise.duration;

          resJson["description"] = newExercise.description;

          // console.log("resJson--->", resJson)
          res.json(resJson);
        } else if (dataExist === null) {
          //data no exist
          res.json("User No Exist");
        }
      } catch (error) {
        console.log("error'--->", error);
      }
    }
    exercisesLog();
  }
);
app.get(
  "/api/users/:_id/logs",
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
   
    let id = req.params._id;
    async function userExercisesLog() {
      try {
        //try to fix the updated user info first !

        const exercisesLog = await User.findById(id);
       
        let exercisesJson = {};
        exercisesJson["_id"] = exercisesLog._id;
        exercisesJson["username"] = exercisesLog.username;

        let fromDate = new Date(0);
        let toDate = new Date();
        if (req.query.from || req.query.to) {
          if (req.query.from) {
            fromDate = new Date(req.query.from);
          }
          if (req.query.to) {
            toDate = new Date(req.query.to);
          }
          fromDate = fromDate.getTime();
          toDate = toDate.getTime();
          console.log("fromDate--->", fromDate);
          // exercisesLog.log.filter(date => exercisesLog.log.date >= fromDate && exercisesLog.log.date<= toDate )
        }
          const logJson = exercisesLog.log.filter((exercise) => {
            let exerciseDate = new Date(exercise.date).getTime();
            console.log("exerciseDate getTime()--->", exerciseDate);
            
            console.log("toDate--->", toDate);
            console.log("exerciseDate after filter--->", exerciseDate);
            return exerciseDate >= fromDate && exerciseDate <= toDate;
          });
          exercisesJson["count"] = logJson.length;
          exercisesJson["log"] = logJson;
          console.log("logJson--->", logJson);
        // if (req.query.limit){
        //   exercisesJson["count"] = exercisesLog.slice(0, req.query.limit).length;
        //   exercisesJson["log"] = exercisesLog.slice(0, req.query.limit)
        // }
        console.log("exercisesJson[log]--->", exercisesLog.log);

        res.json(exercisesJson);
      } catch (error) {
        console.log(error);
      }
    }
    userExercisesLog();
  }
);
