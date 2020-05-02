const router = require('express').Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");

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
router.post("/", (req, res) => {
	let newCampground = {
		name: req.body.name,
		url: req.body.url,
		description: req.body.description
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
router.get("/new", (req, res) => {
	res.render("campgrounds/new");
})

// SHOW - Shows more info about one campground
router.get("/:id", (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec((err, campground) => {
		res.render("campgrounds/show", { campground: campground });
	});
})

module.exports = router;
