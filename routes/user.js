const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


// Signup Route
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs", { messages: req.flash() });
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    await User.register(newUser, password);

    // Automatically log the user in after successful signup
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to WanderLust!");

      const redirectUrl = req.session.redirectUrl || "/listings";
      delete req.session.redirectUrl; // Clear redirect URL
      res.redirect(redirectUrl);
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

// Login Route
router.get("/login", (req, res) => {
  res.render("users/login.ejs", { messages: req.flash() });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);

// Review Routes
router.post("/listings/:id/reviews", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = new Review({ 
      rating, 
      comment, 
      user: req.user._id, 
      listing: id 
    });

    await review.save();

    // Optionally, you can populate the user data in the review if needed
    await review.populate('user', 'username').execPopulate();

    res.status(201).json(review); // Respond with the created review
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create review" });
  }
});

router.get("/listings/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ listing: id }).populate('user', 'username').exec();
    res.json(reviews); // Respond with the list of reviews
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch reviews" });
  }
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be logged in to do that.");
  res.redirect("/login");
}

module.exports = router;

