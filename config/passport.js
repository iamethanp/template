var LocalStrategy = require("passport-local").Strategy;
var User = require("../app/models/user.js");

module.exports = function(passport) {
	passport.serializeUser(function(user, done){
		done(null, user.id);
	})

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user){
			done(err, user);
		})
	})

	passport.use("local-register", new LocalStrategy({
		usernameField:"username",
		passwordField:"password",
		passReqToCallback: true
	},
	function(req, username, password, done) {
		process.nextTick(function() {
			User.findOne({"username":new RegExp("^"+username+"$", "i")}, function(err, user){
				if(err) {
					return done(err);
				}
				if(user) {
					return done(null, false, req.flash("registerMessage", "User already exists."));
				}
				if(username.length>14) {
					return done(null, false, req.flash("registerMessage", "Username must be 14 characters or less."))
				}
				if(!/^[a-zA-Z0-9]+$/i.test(password)) {
					return done(null, false, req.flash("registerMessage", "Password must only contain letters and numbers."));
				}
				if(!/^[a-zA-Z0-9]+$/i.test(username)) {
					return done(null, false, req.flash("registerMessage", "Username must only contain letters and numbers."));
				}
				if(password!=req.body.confirm_password) {
					return done(null, false, req.flash("registerMessage", "Passwords don't match."));
				}
				if(password.length==0 || username.length==0 || req.body.confirm_password.length==0) {
					return done(null, false, req.flash("registerMessage", "Please fill in all fields."));
				}
				else {
					var newUser = new User();
					newUser.username = username;
					newUser.password = newUser.generateHash(password);
					newUser.save(function(err){
						if(err) throw err;
						return done(null, newUser);
					})
				}
			})
		})
	}))

  passport.use("local-login", new LocalStrategy({
		usernameField: "username",
		passwordField: "password",
		passReqToCallback: true
	},
	function(req, username, password, done) {
		process.nextTick(function() {
			User.findOne({"username": username}, function(err, user) {
				if(err) {
					return done(err);
				}
				if(!user) {
					return done(null, false, req.flash("loginMessage", "No User Found."));
				}
        if(!user.validPassword(password)) {
					return done(null, false, req.flash("loginMessage", "Invalid Password."));
				}
				if(password.length==0 || username.length==0) {
					return done(null, false, req.flash("loginMessage", "Please fill in all fields."));
				}
				if(user.isBanned) {
					return done(null, false, req.flash("loginMessage", "User is banned."))
				}
				else {
					return done(null, user);
				}
			})
		})
	}))
}
