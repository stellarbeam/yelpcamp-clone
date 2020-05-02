const router = require('express').Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
	var id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err)
			res.send("Error")
		else
			res.render("comments/new", { campground: campground });
	});
})

router.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
	var id = req.params.id;
	var comment = req.body.comment;
	Campground.findById(id, (err, campground) => {
		if (err)
			res.send("Error")
		else {
			Comment.create(comment, (err, newComment) => {
				if (err)
					res.send("Error");
				else {
					campground.comments.push(newComment);
					campground.save();
					res.redirect(`/campgrounds/${id}`);
				}
			})
		}
	});
})

module.exports = router;
