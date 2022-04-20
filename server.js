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
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String,

});
const userSchema = mongoose.Schema({
  username: { type: String, required: true },

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


app.post("/api/users", bodyParser.urlencoded({ extended: false }), (req, res) => {
  //enter ther username, submit and --- res.json({"username":"60018990","_id":"625accf6bd912806f3884f37"}), if username is empty,return error:( ValidationError: Users validation failed: username: Path `username` is required.)
  let username = req.body.username
  async function doWork() {
    try {
      const dataExist = await User.findOne({ username: username })

      let resJson = {};
      if (dataExist !== null) {
        resJson["username"] = dataExist.username;
        resJson["id"] = dataExist.id;
        res.json(resJson);

        //console.log(resJson);
      } else if (dataExist === null) {

        let newUser = new User({ username: username });
        //console.log("username----", newUser);
        newUser.save((error, savedUser) => {
          resJson["username"] = savedUser.username;
          resJson["id"] = savedUser.id;
          //console.log(resJson);
          res.json(resJson);
        })
      }
    } catch (error) {
      console.log("error--->", error)
    }
  }
  doWork();
})

app.post("/api/users/:_id/exercises",bodyParser.urlencoded({ extended: false }), (req, res) => {
  let userId = req.params._id;
  let userDuration = req.body.duration;
  let userDescription = req.body.description;
  //res.json({"_id":"625acdc3bd912806f3884f3a","username":"15172234","date":"Sat Apr 16 2022","duration":10,"description":"Green pass"})
  async function exercisesLog(){
    try{
      const dataExist = await User.findOne({ username: username })

      let resJson = {};
      if (dataExist !== null) {
        //data exist
        resJson["id"] = dataExist.id;
        resJson["username"] = dataExist.username;
        //resJson["date"] = dataExist.date;
        resJson["duration"] = dataExist.userDuration;
        resJson["description"] = dataExist.userDescription;
        
        res.json(resJson);

        //console.log(resJson);
      } else if (dataExist === null){
        //data no exist
        res.json("User No Exist")
      }

    }catch(error){
      console.log("error'--->", error)
    }
  }
});
app.get("/api/users/:_id/logs?[from][&to][&limit]", (req, res) => {
  let userId = req.params._id;
  //
  //
})