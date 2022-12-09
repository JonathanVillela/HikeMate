const mongoose = require('mongoose');
const trail = require('../models/trail');

mongoose.connect('mongodb://localhost:27017/HikeMate');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});

const seedDB = async () => {
    await trail.deleteMany({});
    const c = new trail({ title: 'purple field' });
    await c.save();
}

seedDB();