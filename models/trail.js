const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TrailSchema = new Schema({
    title: String,
    image: String,
    length: Number,
    description: String,
    location: String,
    reviews: [
        {
            // stipulates object ID from review model
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Trail', TrailSchema);