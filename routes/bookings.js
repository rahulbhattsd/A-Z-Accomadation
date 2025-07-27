/* routes/bookings.js */
const express     = require('express');
const router      = express.Router();
const Listing     = require('../models/listing');
const Transaction = require('../models/transaction');
const wrapAsync   = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware/isLoggedIn');

// 1. Show booking page with fee calculation
router.get('/:id/book', isLoggedIn, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  const platformFee = Number((listing.price * 0.10).toFixed(2));
  const totalAmount = listing.price + platformFee;
  res.render('bookings/new', { listing, platformFee, totalAmount });
}));

// 2. Handle booking form submission
router.post('/:id/book', isLoggedIn, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new Error('Listing not found');

  const amount      = listing.price;
  const platformFee = Number((amount * 0.10).toFixed(2));
  const totalAmount = amount + platformFee;

  const transaction = new Transaction({
    listing: listing._id,
    user:    req.user._id,
    amount,
    platformFee,
    totalAmount,
    status: 'Pending'
  });
  await transaction.save();

  listing.transactions.push(transaction);
  await listing.save();

  // ✅ Redirect to fake payment UI instead of /listings/:id
  res.redirect(`/payments?amount=${totalAmount}&title=${encodeURIComponent(listing.title)}`);
}));
module.exports = router;

