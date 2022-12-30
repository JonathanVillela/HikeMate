module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.flash('error', 'Login required');
        return res.redirect('/login');
    }
    next();
}