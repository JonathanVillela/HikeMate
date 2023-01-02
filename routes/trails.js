const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { trailSchema, reviewSchema } = require('../validationSchema.js');
const { isLoggedIn, isAuthor, validateTrail } = require('../middleware');

const Trail = require('../models/trail');



router.get('/', catchAsync(async (req, res, next) => {
    const trails = await Trail.find({});
    res.render('trails/index', { trails })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('trails/new');
});

router.post('/', isLoggedIn, validateTrail, catchAsync(async (req, res, next) => {
    const trail = new Trail(req.body.trail);
    trail.author = request.user._id;
    await trail.save();
    req.flash('success', 'Successfully contributed a new trail!');
    res.redirect(`/trails/${trail._id}`)
}));

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id).populate('reviews').populate('author');
    if (!trail) {
        req.flash('error', 'Trail does not or no longer exists.');
        return res.redirect('/trails');
    }
    res.render('trails/show', { trail });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const trail = await Trail.findById(id)
    if (!trail) {
        req.flash('error', 'Trail does not or no longer exists.');
        return res.redirect('/trails');
    }
    res.render('trails/edit', { trail });
}));

router.put('/:id', isLoggedIn, isAuthor, validateTrail, catchAsync(async (req, res,) => {
    const { id } = req.params;

    // const trail = await Trail.findByIdAndUpdate(id, { ...req.body.trail });
    req.flash('success', 'Trail successfully edited.');
    res.redirect(`/trails/${trail._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

module.exports = router;