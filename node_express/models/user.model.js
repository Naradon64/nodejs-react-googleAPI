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
        }
    },
    {
        timestamps: true, 
    }
);

const user = mongoose.model("users", userSchema);

module.exports = user;
