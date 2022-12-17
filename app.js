const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const methodOverride = require('method-override');
const Trail = require('./models/trail');


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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/trails', catchAsync(async (req, res, next) => {
    const trails = await Trail.find({});
    res.render('trails/index', { trails })
}))

app.get('/trails/new', (req, res) => {
    res.render('trails/new');
})

app.post('/trails', catchAsync(async (req, res, next) => {
    const trail = new Trail(req.body.trail);
    await trail.save();
    res.redirect(`/trails/${trail._id}`) //directs to new trail
}))

app.get('/trails/:id', catchAsync(async (req, res, next) => {
    const trail = await Trail.findById(req.params.id)
    res.render('trails/show', { trail });
}))

app.get('/trails/:id/edit', catchAsync(async (req, res, next) => {
    const trail = await Trail.findById(req.params.id)
    res.render('trails/edit', { trail });
}))

app.put('/trails/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const trail = await Trail.findByIdAndUpdate(id, { ...req.body.trail });
    res.redirect(`/trails/${trail._id}`)
}))

app.delete('/trails/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    res.redirect('/trails');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Error Handling: Internal Server Error
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on Port 3000')
})