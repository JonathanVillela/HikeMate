const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const trail = require('./models/trail');

mongoose.connect('mongodb://localhost:27017/HikeMate');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/addtrail', async (req, res) => {
    const hike = new trail({ title: 'duck creek', description: 'free' });
    await hike.save();
    res.send(hike)
})


app.listen(3000, () => {
    console.log('Serving on Port 3000')
})