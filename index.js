const path = require("path");
const fileURLToPath = require("url");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json()); // <==== parse request body as JSON

app.use(express.static(path.join("public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Connect to DB
//Azure db
mongoose.connect(
  "mongodb+srv://jlindsay82:R0xyf0xie!@jamesdb.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000",
  {}
);

//mongoose.connect("mongodb://localhost:27017/songnotes", {}); //local

const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

//routes
const User = require("./models/user");

app.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    throw new Error("Error fetching items: " + error.message);
  }
});

app.post("/newUser", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });
    const storedUser = await newUser.save();
    const response = await storedUser;
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    throw new Error("Error fetching items: " + error.message);
  }
});

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
