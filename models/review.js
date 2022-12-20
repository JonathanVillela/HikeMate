const mongoose = require('mongoose');
const Schema = mongoose.Schema


//one to many relationship
const reviewSchema = new Schema({
    body: String,
    rating: Number,

});

module.exports = mongoose.model("Review", reviewSchema);