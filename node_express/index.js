const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userModel = require('./models/user.model.js')
const auth = require('./middleware/auth.js');
const user = require("./models/user.model.js");


const app = express();

require('dotenv').config(); // load ENV
const port = process.env.PORT; // Access PORT
const MONGO_URI = process.env.MONGO_URI; // Access MONGO_URI

app.use(express.json());
app.use(cors());

// get all users
app.get("/users", auth.verifyToken, (req, res) => {
    userModel
      .find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json({ error: err.message }));
  });

// get user by _id
app.get('/users/:_id', auth.verifyToken, (req, res) => {
    const { _id } = req.params;
    userModel.findById(_id)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(201).json(user);
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  });

app.post('/register', async (req, res) => {
    try {

        // Check if name or email or password is blank or null
        if (req.body.name == null || req.body.email == null || req.body.password == null || req.body.age == null || req.body.address == null || req.body.latitude == null || req.body.longitude == null){
           return res.status(400).json({message : 'Some values in req.body is blank (null)'});
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: 'This email is already registered.' });
        }

        // validate input on user.models.js (such as no email, name or password)
        req.body.role = "user"; // if it's register through this api, then it's normal user
        const user = await userModel.create(req.body);
        res.status(201).json(user); 
    } catch (err) {
        res.status(400).json(err);
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" }); // Not Found Status
        }
        
        if (user.password === password) {
            console.log(user)
            const token = auth.generateToken(user);
            console.log(token)
            return res.status(201).json({ user, token }); // Created Status
          } else {
            return res.status(401).json({ message: 'Authentication failed. Incorrect password.' }); // Not Authorized Status
          }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put('/users/:id', auth.verifyToken, async (req, res) => {
    try {
        const {id} = req.params;
        const updateData = req.body;
        const user = await userModel.findByIdAndUpdate(id, updateData, {new: true});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Verify the token
app.get('/verify', auth.verifyToken, (req, res) => {
    res.status(200).json({ success: true, message: 'Token is valid', user: req.user });
  });
  
// Get Google API key for FrontEnd
app.get('/api/get-google-maps-api-key', (req, res) => {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    res.json({ apiKey: googleMapsApiKey });
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

