const express = require("express"),
	app = express(),
	expressSession = require('express-session'),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	User = require("./models/user"),
	seedDB = require("./seeds");

const campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index")

// Express setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// Mongoose setup
mongoose.connect("mongodb://mongo:27018/yelp_camp", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(() => {
	console.log("MongoDB is connected!");
	// seedDB();
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

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
})

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(3000, () => {
	console.log("Listening on port 3000");
})
