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


app.post("/api/users",bodyParser.urlencoded({ extended: false }), (req, res)=>{
  //User.findOne()
  //enter ther username, submit and --- res.json({"username":"60018990","_id":"625accf6bd912806f3884f37"}), if username is empty,return error:( ValidationError: Users validation failed: username: Path `username` is required.)
  let newUser = new User({username: req.body.username });

  console.log("username----", newUser);
  newUser.save((error, savedUser)=>{
    if(!error){
      let resJson ={};
      resJson["username"]= savedUser.username;
      resJson["id"]= savedUser.id;
      //console.log(resJson);
      res.json(resJson);
    }else{
      console.log(error)
    }
  } )
} )

app.post("/api/users/:_id/exercises", (req, res)=>{
  let userId=req.params._id;
  //res.json({"_id":"625acdc3bd912806f3884f3a","username":"15172234","date":"Sat Apr 16 2022","duration":10,"description":"Green pass"})
} );
app.get( "/api/users/:_id/logs?[from][&to][&limit]", (req, res)=>{
  let userId=req.params._id;
  //
  //
})