const router = require('express').Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	es.redirect('/login');
}

// NEW - Show form to create new comment
router.get("/new", isLoggedIn, (req, res) => {
	var id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err)
			res.send("Error")
		else
			res.render("comments/new", { campground: campground });
	});
})

// CREATE - Add new comment
router.post("/", isLoggedIn, (req, res) => {
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
