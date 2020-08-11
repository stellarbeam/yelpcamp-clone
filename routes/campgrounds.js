const router = require('express').Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
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
}

// INDEX - Show all campgrounds
router.get("/", (req, res) => {
	Campground.find({}, (err, matchedCampgrounds) => {
		if (err) {
			console.log(error);
			res.send("Oops, seems something went wrong!");
		} else {
			res.render("campgrounds/index", { campgrounds: matchedCampgrounds });
		}
	})
})

// CREATE - Add new campground 
router.post("/", isLoggedIn, (req, res) => {
	let newCampground = {
		name: req.body.name,
		url: req.body.url,
		description: req.body.description,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	}

	Campground.create(newCampground, (err, campground) => {
		if (err) {
			console.log(err);
			res.send("Oops, seems something went wrong!");
		} else {
			res.redirect("/campgrounds"); // defaults to GET method
		}
	})
})

// NEW - Show form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
})

// SHOW - Shows more info about one campground
router.get("/:id", (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec((err, campground) => {
		res.render("campgrounds/show", { campground: campground });
	});
})

// EDIT - Show form to edit a campground
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
	var id = req.params.id;
	Campground.findById(id, (err, foundCampground) => {
		if (err) {
			res.redirect("/campgrounds")
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	})
});

// UPDATE - Reflect changes in database
router.put('/:id', checkCampgroundOwnership, (req, res) => {
	var id = req.params.id;
	var campground = req.body.campground;
	Campground.findByIdAndUpdate(id, campground, (err, updatedCampground) => {
		if (err) {
			res.redirect("/campgrounds")
		} else {
			res.redirect(`/campgrounds/${id}`);
		}
	})
});

// DESTROY - Delete a campground
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
	var id = req.params.id;

	Campground.findByIdAndRemove(id, (err, campgroundRemoved) => {
        if (err) {
			console.log(err);
			res.redirect("/campgrounds");
        } else {
			Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, err => {
				if (err) {
					console.log(err);
					res.redirect("/campgrounds");
				} else {
					console.log("Comments removed.");
					res.redirect("/campgrounds");
				}
			});
		}
        
    })
});

module.exports = router;
