const   express     = require("express"),
		app         = express(),
		bodyParser  = require("body-parser"),
		mongoose    = require("mongoose"),
		Campground  = require("./models/campground"),
		Comment		= require("./models/comment")
		seedDB		= require("./seeds");


// Express setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

//Mongoose setup
mongoose.connect("mongodb://mongo:27018/yelp_camp", {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("MongoDB is connected!");
}).catch( err => {
	console.log("Error occured");
	console.log(err);
});

seedDB();

// ------------- ROUTES -------------- //

app.get("/", (req, res) => {
	res.render("landing");
})

app.get("/campgrounds", (req, res) => {
	Campground.find({}, (err, matchedCampgrounds) => {
		if(err) {
			console.log(error);
			res.send("Oops, seems something went wrong!");
		} else {
			res.render("campgrounds/index", {campgrounds: matchedCampgrounds});
		}
	})
})

app.post("/campgrounds", (req, res) => {
	let newCampground = {
		name: req.body.name,
		url: req.body.url,
		description: req.body.description
	}
	
	Campground.create( newCampground, (err, campground) => {
		if(err) {
			console.log(err);
			res.send("Oops, seems something went wrong!");
		} else {
			res.redirect("/campgrounds"); // defaults to GET method
		}
	})
})

app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
})

app.get("/campgrounds/:id", (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec( (err, campground) => {
		res.render("campgrounds/show", {campground: campground});
	});	
})

app.get("/campgrounds/:id/comments/new", (req, res) => {
	var id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if(err)
			res.send("Error")
		else
			res.render("comments/new", {campground: campground});
	});
})

app.post("/campgrounds/:id/comments", (req, res) => {
	var id = req.params.id;
	var comment = req.body.comment;
	Campground.findById(id, (err, campground) => {
		if(err)
			res.send("Error")
		else {
			Comment.create(comment, (err, newComment) => {
				if(err)
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

app.listen(3000, () => {
	console.log("Listening on port 3000");
})
