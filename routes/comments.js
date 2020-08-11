const router = require('express').Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
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
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					campground.comments.push(newComment);
					campground.save();
					res.redirect(`/campgrounds/${id}`);
				}
			})
		}
	});
})

// EDIT - Edit a comment
router.get("/:comment_id/edit", (req, res) => {
	var campgroundId = req.params.id;
	var commentId = req.params.comment_id;

	Comment.findById(commentId, (err, foundComment) => {
		if (err) 
			res.redirect("back");
		else {
			res.render("comments/edit", {campgroundId: campgroundId, comment: foundComment});
		}
	});
})

router.put('/:comment_id', (req, res) => {
	var campgroundId = req.params.id;
	var commentId = req.params.comment_id;
	var comment = req.body.comment;

	Comment.findByIdAndUpdate(commentId, comment, err => {
		if (err) 
			res.redirect("back");
		else {
			res.redirect(`/campgrounds/${campgroundId}`);
		}
	});
});

module.exports = router;
