const mongoose = require('mongoose');

// création du schéma pour une sauce

const sauceSchema = mongoose.Schema({
    userId: { type: String },
    name: { type: String },
    manufacturer: { type: String },
    description: { type: String},
    mainPepper: { type: String },
    imageUrl: { type: String },
    heat: { type: Number },
    likes: { type: Number },
    dislikes: { type: Number },
    userLiked: [String],
    userDisliked: [String],
});

module.exports = mongoose.model('Sauce', sauceSchema);