const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { trailSchema, reviewSchema } = require('./validationSchema.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const methodOverride = require('method-override');
const Trail = require('./models/trail');
const Review = require('./models/review');



mongoose.connect('mongodb://localhost:27017/HikeMate');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true })); //parse POST reqs
app.use(methodOverride('_method'));

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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.maps(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home')
});

app.get('/trails', catchAsync(async (req, res, next) => {
    const trails = await Trail.find({});
    res.render('trails/index', { trails })
}));

app.get('/trails/new', (req, res) => {
    res.render('trails/new');
});

app.post('/trails', validateTrail, catchAsync(async (req, res, next) => {
    const trail = new Trail(req.body.trail);
    await trail.save();
    res.redirect(`/trails/${trail._id}`)
}));

app.get('/trails/:id', catchAsync(async (req, res, next) => {
    const trail = await Trail.findById(req.params.id)
    res.render('trails/show', { trail });
}));

app.get('/trails/:id/edit', catchAsync(async (req, res, next) => {
    const trail = await Trail.findById(req.params.id).populate('reviews');
    res.render('trails/edit', { trail });
}));

app.put('/trails/:id', validateTrail, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const trail = await Trail.findByIdAndUpdate(id, { ...req.body.trail });
    res.redirect(`/trails/${trail._id}`)
}));

app.delete('/trails/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    res.redirect('/trails');
}));

app.post('/trails/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    const review = new Review(req.body.review);
    trail.reviews.push(review);
    await review.save();
    await trail.save();
    res.redirect(`/trails/${trail._id}`);
}));

app.delete('/trails/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Trail.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//removes from array
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/trails/${id}`);
}))



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

// Error Handling: Internal Server Error
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
    console.log('Serving on Port 3000')
});