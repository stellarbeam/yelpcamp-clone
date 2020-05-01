const express = require("express"),
	app = express(),
	expressSession = require('express-session'),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");


// Express setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Mongoose setup
mongoose.connect("mongodb://mongo:27018/yelp_camp", {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("MongoDB is connected!");
	seedDB();
}).catch(err => {
	console.log("Error occured");
	console.log(err);
});

// Passport setup
app.use(expressSession({
	secret: "I have peanuts in the tangy cup",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
})

// ------------- CAMPGROUNDS ROUTES -------------- //

app.get("/", (req, res) => {
	res.render("landing");
})

// INDEX - Show all campgrounds
app.get("/campgrounds", (req, res) => {
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
app.post("/campgrounds", (req, res) => {
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
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
})

// SHOW - Shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec((err, campground) => {
		res.render("campgrounds/show", { campground: campground });
	});
})

// ------------- COMMENTS ROUTES -------------- //

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
	var id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err)
			res.send("Error")
		else
			res.render("comments/new", { campground: campground });
	});
})

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

// ------------- AUTH ROUTES -------------- //
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/register', (req, res) => {
	res.render("register")
});

app.post('/register', (req, res) => {
	User.register(
		new User({ username: req.body.username }),
		req.body.password
	).then(user => {
		passport.authenticate("local")(req, res, () => {
			res.redirect("/campgrounds");
		})
	}).catch(() => {
		console.log("Error!");
		res.redirect("/register");
	})
});

app.get('/login', (req, res) => {
	res.render("login");
});

app.post('/login', passport.authenticate("local", {
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}),
	(req, res) => { }
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});


app.listen(3000, () => {
	console.log("Listening on port 3000");
})
