const router = require('express').Router();
const User = require("../models/user");
const passport = require("passport");

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get("/", (req, res) => {
	res.render("landing");
})

router.get('/register', (req, res) => {
	res.render("register")
});

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

router.get('/login', (req, res) => {
	res.render("login");
});

router.post('/login', passport.authenticate("local", {
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}),
	(req, res) => { }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;
