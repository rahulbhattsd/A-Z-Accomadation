require('dotenv').config();

const express         = require("express");
const app             = express();
const port            = process.env.PORT || 8080;
const mongoose        = require("mongoose");
const methodOverride  = require("method-override");
const expressLayouts  = require("express-ejs-layouts");
const wrapAsync       = require("./utils/wrapAsync.js");
const ExpressError    = require("./utils/ExpressError.js");

const passport        = require("passport");
const LocalStrategy   = require("passport-local");
const User            = require("./models/user.js");
const session         = require("express-session");
const MongoStore      = require("connect-mongo");
const flash           = require("connect-flash");

const Listing         = require("./models/listing.js");
const userRouter      = require("./routes/user.js");
const bookingRouter   = require("./routes/bookings.js");  // ↖ booking routes

// 1) Database connection
mongoose.connect(process.env.ATLASDB_URL, { ssl: true,  tls: true, serverSelectionTimeoutMS: 5000, })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error("Database connection error:", err));

// 2) View engine + static + parsing
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

// 3) Session & Flash
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: { secret: process.env.SESSION_SECRET || "your_secret" },
  touchAfter: 24 * 3600
});
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret",
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(flash());

// 4) Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 5) Global middleware for flash & user
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.success     = req.flash("success");
  res.locals.error       = req.flash("error");
  next();
});

// 6) Auth check helper
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.session.redirectUrl = req.originalUrl;
  req.flash("error", "You must be logged in to access that.");
  res.redirect("/login");
}

// 7) Routes
app.use("/", userRouter);
app.use("/listings", bookingRouter);         // ↖ mount booking routes under /listings

// --- Your existing Listing CRUD routes ---
app.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.render("listings/index", { allListings });
}));

app.get("/home", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.render("listings/home", { allListings });
}));

app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.render("listings/index", { allListings });
}));

app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

app.post("/listings", isLoggedIn, wrapAsync(async (req, res) => {
  const listing = new Listing({ ...req.body.listing, owner: req.user._id });
  await listing.save();
  req.flash("success", "Listing created!");
  res.redirect("/listings");
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("owner");
  if (!listing) throw new ExpressError(404, "Listing not found");
  res.render("listings/show", { listing });
}));

app.get("/listings/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found");
  res.render("listings/edit", { listing });
}));

app.put("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${req.params.id}`);  // ← fixed back-ticks
}));

app.delete("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
}));

app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect("/login");
  });
});
// Booking route (fake Razorpay style)
app.post("/listings/:id/book", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  if (listing.isBooked) {
    req.flash("error", "This listing is already booked.");
    return res.redirect(`/listings/${id}`);
  }

  // Mark as booked
  listing.isBooked = true;
  listing.bookedBy = req.user._id;
  await listing.save();

  const platformFee = Math.round(listing.price * 0.1);
  const totalAmount = listing.price + platformFee;

  const username = req.user.username;

  res.redirect(`/payments?amount=${totalAmount}&title=${encodeURIComponent(listing.title)}&username=${encodeURIComponent(username)}`);
});

// Payment page render
app.get("/payments", (req, res) => {
  const { amount, title, username } = req.query;
  res.render("payments/fake", {
    amount: parseInt(amount),
    title,
    username,
  });
});

// Fake success handler
app.post("/fake-payment-success", (req, res) => {
  const { amount, title, username } = req.body;
  res.send(`
    <h2>✅ Payment of ₹${parseInt(amount).toLocaleString('en-IN')} for "${title}" was successful!</h2>
    <h3>📦 Booked by <strong>${username}</strong></h3>
  `);
});


// 8) 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// 9) General error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// 10) Start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});







