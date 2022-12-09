const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TrailSchema = new Schema({
    title: String,
    length: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Trail', TrailSchema);