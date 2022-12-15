const mongoose = require('mongoose');
const Trail = require('../models/trail');
const cities = require('./cities');
const { places, descriptors } = require('./places');

mongoose.connect('mongodb://localhost:27017/HikeMate');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    await Trail.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const hike = new Trail({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await hike.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})