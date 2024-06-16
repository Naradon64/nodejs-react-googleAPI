const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require('./models/user.model.js')



const app = express();

require('dotenv').config(); // load ENV
const port = process.env.PORT; // Access PORT
const MONGO_URI = process.env.MONGO_URI; // Access MONGO_URI

app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    try {
        const users = await userModel.create(req.body);
        res.status(201).json(users); 
    } catch (err) {
        res.status(400).json(err);
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (user.password === password) {
            res.json("Success");
            console.log("Success");
        } else {
            res.json("Wrong password");
            console.log("Wrong password");
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


mongoose.connect(
    MONGO_URI
  )
    .then(() => {
      console.log("Connected to the database!");
      app.listen(port, () => {
        console.log(`Listening to port: ${port}`);
      });
    })
    .catch((err) => {
      console.error("Connection failed:", err.message);
    });

