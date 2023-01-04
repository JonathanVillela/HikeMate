const Trail = require('../models/trail');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res, next) => {
    const trails = await Trail.find({});
    res.render('trails/index', { trails })
}

module.exports.renderNewForm = (req, res) => {
    res.render('trails/new');
}

module.exports.createTrail = async (req, res, next) => {
    const trail = new Trail(req.body.trail);
    trail.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    trail.author = req.user._id;
    await trail.save();
    console.log(trail);
    req.flash('success', 'Successfully contributed a new trail!');
    res.redirect(`/trails/${trail._id}`)
}

module.exports.showTrail = async (req, res) => {
    const trail = await Trail.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(trail);
    if (!trail) {
        req.flash('error', 'Trail does not or no longer exists.');
        return res.redirect('/trails');
    }
    res.render('trails/show', { trail });
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const trail = await Trail.findById(id)
    if (!trail) {
        req.flash('error', 'Trail does not or no longer exists.');
        return res.redirect('/trails');
    }
    res.render('trails/edit', { trail });
}

module.exports.updateTrail = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const trail = await Trail.findByIdAndUpdate(id, { ...req.body.trail });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    trail.images.push(...imgs); //pushes new images, no deletion of existing img
    await trail.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await trail.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated trail!');
    res.redirect(`/trails/${trail._id}`)
}

module.exports.deleteTrail = async (req, res) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted trail')
    res.redirect('/trails');
}