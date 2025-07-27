const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters long'],
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: {
      filename: String,
      url: String,
    },
    default: {
      filename: 'default-image',
      url: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    validate: {
      validator: function (v) {
        return /^[A-Za-z\s]+$/.test(v);
      },
      message: props => `${props.value} is not a valid country name!`,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction"
    }
  ]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
