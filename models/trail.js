const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TrailSchema = new Schema({
    title: String,
    image: String,
    length: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Trail', TrailSchema);