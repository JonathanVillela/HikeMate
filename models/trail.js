const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema

const TrailSchema = new Schema({
    title: String,
    image: String,
    length: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            // stipulates object ID from review model
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//Deletes trail reviews when corresponding trail is deleted 
TrailSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Trail', TrailSchema);