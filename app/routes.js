module.exports = function(app, passport) {
  app.get("/", function (req, res) {
    if(req.isAuthenticated()) res.redirect("/play");
    else res.render("index.ejs", {loginMessage:req.flash("loginMessage"), registerMessage:req.flash("registerMessage")});
  });

  app.post("/register", passport.authenticate("local-register", {
    successRedirect: "/play",
    failureRedirect: "/",
    failureFlash: true
  }));

  app.post("/login", passport.authenticate("local-login", {
    successRedirect: "/play",
    failureRedirect: "/",
    failureFlash: true
  }));

  app.get("/play", isLoggedIn, function(req, res) {
    res.render("game.ejs", {user: req.user});
  });

  app.get("/banned", isLoggedIn, function(req, res) {
    req.logout();
    res.redirect("/");
  });
}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
