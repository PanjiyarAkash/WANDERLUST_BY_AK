const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { listingSchema } = require('../schema');
const Review = require("./review.js");
const { required } = require("joi");

const listeningSchema = new Schema({
  title: {
    type: String,
    required:true,
},
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price:Number,
  location:String,
  country:String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: ["trending","rooms","iconic cities","mountains","castles","amazing pools","camping","farms","arctic"],
    required: true,
  }
});

// work as middleware for deleting all review related to particular listing if delete a particular listing
listeningSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing = mongoose.model("Listing",listeningSchema);
module.exports = Listing;
