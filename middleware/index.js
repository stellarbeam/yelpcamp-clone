const Campground = require("../models/campground");
const Comment = require("../models/comment");

module.exports = {

    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    },

    checkCampgroundOwnership: function(req, res, next) {
        var id = req.params.id;
        if (req.isAuthenticated()) {
            Campground.findById(id, (err, foundCampground) => {
                if (err) {
                    res.redirect("back")
                } else {
                    if (foundCampground.author.id.equals(req.user.id)) {
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back")
        }
    },

    checkCommentOwnership: function(req, res, next) {
        var id = req.params.comment_id;
        if (req.isAuthenticated()) {
            Comment.findById(id, (err, foundComment) => {
                if (err) {
                    res.redirect("back")
                } else {
                    if (foundComment.author.id.equals(req.user.id)) {
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back")
        }
    }
}