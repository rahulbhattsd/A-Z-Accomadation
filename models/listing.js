const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'], // Ensure title is required
    minlength: [3, 'Title must be at least 3 characters long'], // Minimum length validation
    maxlength: [100, 'Title cannot exceed 100 characters'], // Maximum length validation
  },
  description: {
    type: String,
    required: [true, 'Description is required'], // Ensure description is required
    minlength: [10, 'Description must be at least 10 characters long'], // Minimum length validation
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
    required: [true, 'Price is required'], // Ensure price is required
    min: [0, 'Price must be a positive number'], // Validate that price is non-negative
  },
  location: {
    type: String,
    required: [true, 'Location is required'], // Ensure location is required
  },
  country: {
    type: String,
    required: [true, 'Country is required'], // Ensure country is required
    validate: {
      validator: function(v) {
        return /^[A-Za-z\s]+$/.test(v); // Validate that country name only contains letters and spaces
      },
      message: props => `${props.value} is not a valid country name!`,
    },
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
  });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

//https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60