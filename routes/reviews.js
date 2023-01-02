const express = require('express');
const router = express.Router({ mergeParams: true })
const { validateReview } = require('../middleware')
const Trail = require('../models/trail');
const Review = require('../models/review');

const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', validateReview, catchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    const review = new Review(req.body.review);
    trail.reviews.push(review);
    await review.save();
    await trail.save();
    req.flash('success', 'Review successfully posted!');
    res.redirect(`/trails/${trail._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Trail.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//removes from array
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Trail deleted.');
    res.redirect(`/trails/${id}`);
}))

module.exports = router;