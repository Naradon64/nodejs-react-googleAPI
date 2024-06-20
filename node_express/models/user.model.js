const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "There must be a full legal name for this user"],
        },
        email: {
            type: String,
            required: [true, "Email is missing"],
        },
        password: {
            type: String,
            required: [true, "Password is missing"],
        },
        age: {
            type: Number,
            required: [true, "Age is missing"],
        },
        address: {
            type: String,
            required: [true, "Address is missing"],
        },
        latitude: {
            type: Number,
            required: [true, "latitude is missing"],
        },
        longitude: {
            type: Number,
            required: [true, "longitude is missing"],
        }
    },
    {
        timestamps: true, 
    }
);

const user = mongoose.model("users", userSchema);

module.exports = user;
