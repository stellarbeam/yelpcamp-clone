const router = require('express').Router();
const User = require("../models/user");
const passport = require("passport");

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Root route
router.get("/", (req, res) => {
	res.render("landing");
})

// Register form
router.get('/register', (req, res) => {
	res.render("register")
});

// Register logic
router.post('/register', (req, res) => {
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

// Login form
router.get('/login', (req, res) => {
	res.render("login");
});

// Login logic
router.post('/login', passport.authenticate("local", {
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}),
	(req, res) => { }
);

// Logout logic
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;
