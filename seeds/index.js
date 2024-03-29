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
        const length = Math.floor(Math.random() * 20) + 10
        const hike = new Trail({
            author: '63b2e5f47b09e36fd904a068',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum explicabo accusantium dignissimos cumque atque et harum, possimus illum dicta, quam ipsum nesciunt sint tempore accusamus amet delectus animi architectoVoluptas voluptates magnam saepe cum doloremque ut debitis vero iure dignissimos.',
            length,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dxng855av/image/upload/v1672854204/HikeMate/zwgjutmi5cugn5ockqzp.jpg',
                    filename: 'HikeMate/zwgjutmi5cugn5ockqzp',

                },
                {
                    url: 'https://res.cloudinary.com/dxng855av/image/upload/v1672854204/HikeMate/picek3ag1irvx2hjqy8e.jpg',
                    filename: 'HikeMate/picek3ag1irvx2hjqy8e',

                },
                {
                    url: 'https://res.cloudinary.com/dxng855av/image/upload/v1672854204/HikeMate/bbxgt4qqe5wuyunrpjmg.jpg',
                    filename: 'HikeMate/bbxgt4qqe5wuyunrpjmg',

                }
            ]
        })
        await hike.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
