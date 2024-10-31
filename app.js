require('dotenv').config();  // Load environment variables at the very start

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressLayouts = require("express-ejs-layouts");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const flash = require("connect-flash");
const userRouter = require("./routes/user.js");
const { error } = require('console');

// Set up view engine and layout
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Configure session and flash
app.use(
  session({
    secret: "your_secret_key", // Change to a more secure key in production
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(express.json());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Middleware to add flash messages and user information
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
//mongo-store-session

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:"mysupersecretcode",
  },
  touchAfter:24*3600,
})

// Setup session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: dbUrl }), // Use MongoDB store for sessions
  cookie: { maxAge: 180 * 60 * 1000 } // 3 hours
}));

// Database connection
const dbUrl = process.env.ATLASDB_URL; // Load the MongoDB URL from the environment variable

console.log("Database URL:", dbUrl); // Logging for debugging

// Make sure this is below the dbUrl definition
mongoose.connect(dbUrl, { retryWrites: true, w: "majority" })
  .then(() => console.log("Connected to DB"))
  .catch(console.error);


// Middleware to check login and store redirect URL
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.redirectUrl = req.originalUrl;
  req.flash("error", "You must be logged in to access this page.");
  res.redirect("/login");
}

// Route Handlers
app.get("/", async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.render("listings/index", { allListings });
});

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.render("listings/index", { allListings });
});

app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

app.post(
  "/listings",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    try {
      const listingData = {
        ...req.body.listing,
        owner: req.user._id,
        image: {
          url: req.body.listing.image || 'default-image-url',
        },
      };
      const listing = new Listing(listingData);
      await listing.save();
      req.flash("success", "Listing created successfully!");
      res.redirect("/listings");
    } catch (error) {
      if (error.name === "ValidationError") {
        req.flash("error", Object.values(error.errors).map(e => e.message).join(", "));
        return res.redirect("/listings/new");
      }
      throw error;
    }
  })
);

app.get("/listings/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}));

app.get("/listings/:id/edit", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
});

app.put("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${listing._id}`);
}));

app.delete("/listings/:id", isLoggedIn, wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));



// Add User Routes
app.use("/", userRouter);

// Error handling for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// General error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});












