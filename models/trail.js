const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('.upload', '/upload/w_200');
});

const TrailSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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