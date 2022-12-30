const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { trailSchema, reviewSchema } = require('../validationSchema.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/expressError');
const Trail = require('../models/trail');

//protects against erroneous back-end requests
const validateTrail = (req, res, next) => {
    const { error } = trailSchema.validate(req.body);
    if (error) {
        const msg = error.details.maps(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

router.get('/', catchAsync(async (req, res, next) => {
    const trails = await Trail.find({});
    res.render('trails/index', { trails })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('trails/new');
});

router.post('/', isLoggedIn, validateTrail, catchAsync(async (req, res, next) => {
    const trail = new Trail(req.body.trail);
    await trail.save();
    req.flash('success', 'Successfully contributed a new trail!');
    res.redirect(`/trails/${trail._id}`)
}));

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id).populate('reviews');
    if (!trail) {
        req.flash('error', 'Trail does not or no longer exists.');
        return res.redirect('/trails');
    }
    res.render('trails/show', { trail });
}));

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const trail = await Trail.findById(req.params.id)
    if (!trail) {
        req.flash('error', 'Trail does not or no longer exists.');
        return res.redirect('/trails');
    }
    res.render('trails/edit', { trail });
}));

router.put('/:id', isLoggedIn, validateTrail, catchAsync(async (req, res,) => {
    const { id } = req.params;
    const trail = await Trail.findByIdAndUpdate(id, { ...req.body.trail });
    req.flash('success', 'Trail successfully edited.');
    res.redirect(`/trails/${trail._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    req.flash('success', 'Trail deleted.');
    res.redirect('/trails');
}));

module.exports = router;