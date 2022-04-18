const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
let bodyParser = require("body-parser");
const mongoose = require("mongoose");
const res = require("express/lib/response");
//console.log(process.env.SECRET_KEY,process.env.PORT)
mongoose
  .connect(process.env.SECRET_KEY, {
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
  _id: String,
});
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  _id: String,
});
const logSchema = mongoose.Schema({
  username: { type: String, required: true },
  count: Number,
  _id: String,
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


app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


app.post("/api/users", (req, res)=>{
  //enter ther username, submit and --- res.json({"username":"60018990","_id":"625accf6bd912806f3884f37"}), if username is empty,return error:( ValidationError: Users validation failed: username: Path `username` is required.)
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