const mongoose = require("mongoose");

const userInfoSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female", "secret"], // Ensure the value is one of these
        },
    },
    {
        timestamps: true,
    }
);

const userInfo = mongoose.model("userInfo", userInfoSchema);

module.exports = userInfo;
