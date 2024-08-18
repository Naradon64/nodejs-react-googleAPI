const mongoose = require("mongoose");

const preferGenreSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        favoriteMovie: {
            type: String,
            required: true,
        },
        selectedGenre: {
            type: String,
            required: true,
            enum: ["horror", "action", "comedy", "drama"], 
        },
    },
    {
        timestamps: true,
    }
);

const preferGenre = mongoose.model("preferGenre", preferGenreSchema);

module.exports = preferGenre;
