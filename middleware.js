const { trailSchema, reviewSchema } = require('./validationSchema');
const ExpressError = require('./utils/expressError');
const Trail = require('./models/trail');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.flash('error', 'Login required');
        return res.redirect('/login');
    }
    next();
}

//protects against erroneous back-end requests
module.exports.validateTrail = (req, res, next) => {
    const { error } = trailSchema.validate(req.body);
    if (error) {
        const msg = error.details.maps(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const trail = await Trail.findById(id);
    if (!trail.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit.')
        return res.redirect(`/trails/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.maps(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}