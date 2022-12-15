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
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/87218202',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos eum explicabo accusantium dignissimos cumque atque et harum, possimus illum dicta, quam ipsum nesciunt sint tempore accusamus amet delectus animi architectoVoluptas voluptates magnam saepe cum doloremque ut debitis vero iure dignissimos.Necessitatibus recusandae commodi nesciunt iure unde amet, molestiae nihil incidunt velit ducimus suscipit quisquam architecto voluptatum sint, ipsa exercitationem.Eius minima delectus illum eveniet nesciunt quasi! Distinctio libero laboriosam corrupti delectus fuga similique illo voluptas dolor, inventore itaque alias facilis animi dolores eos accusamus et odio deserunt consequuntur veritatis!',
            length
        })
        await hike.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})