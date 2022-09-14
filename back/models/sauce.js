const mongoose = require("mongoose");

// création du schéma de sauce

const sauceSchema = mongoose.Schema({
    userId: {type: String, reequired: true},
    name: {type: String, reequired: true},
    manufacturer: {type: String, reequired: true},
    description: {type: String, reequired: true},
    mainPepper: {type: String, reequired: true},
    imageUrl: {type: String, reequired: true},
    heat: {type: Number, reequired: true},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]}
});

module.exports = mongoose.model("Sauces", sauceSchema);