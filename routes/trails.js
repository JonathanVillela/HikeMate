const express = require('express');
const router = express.Router();


const catchAsync = require('../utils/catchAsync');
const { trailSchema, reviewSchema } = require('../validationSchema.js');

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

router.get('/new', (req, res) => {
    res.render('trails/new');
});

router.post('/', validateTrail, catchAsync(async (req, res, next) => {
    const trail = new Trail(req.body.trail);
    await trail.save();
    res.redirect(`/trails/${trail._id}`)
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const trail = await Trail.findById(req.params.id)
    res.render('trails/show', { trail });
}));

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const trail = await Trail.findById(req.params.id).populate('reviews');
    res.render('trails/edit', { trail });
}));

router.put('/:id', validateTrail, catchAsync(async (req, res,) => {
    const { id } = req.params;
    const trail = await Trail.findByIdAndUpdate(id, { ...req.body.trail });
    res.redirect(`/trails/${trail._id}`)
}));

router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    res.redirect('/trails');
}));

module.exports = router;