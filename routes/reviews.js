const express = require('express');
const router = express.Router({ mergeParams: true })

const Trail = require('../models/trail');
const Review = require('../models/review');

const { reviewSchema } = require('../validationSchema.js');

const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.maps(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    const review = new Review(req.body.review);
    trail.reviews.push(review);
    await review.save();
    await trail.save();
    res.redirect(`/trails/${trail._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Trail.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//removes from array
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/trails/${id}`);
}))

module.exports = router;