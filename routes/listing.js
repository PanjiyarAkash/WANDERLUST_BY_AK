const express = require('express');
const app = express();
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage });




router
.route("/")
.get( wrapAsync(listingController.index))  // index.route
.post( 
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(  listingController.createListing) // create route
)



// new Route
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm);



router.route("/:id")
.get(wrapAsync( listingController.showListing)) // show route
.put(
    isLoggedIn, 
    isOwner, 
    validateListing, 
    upload.single("listing[image]"),
    wrapAsync( listingController.updateListing)) // update route
.delete(
    isLoggedIn, 
    isOwner, 
    wrapAsync( listingController.destroyListing)) // delete route



//edit Route
router.get("/:id/edit", 
    isLoggedIn, isOwner, 
    wrapAsync( listingController.renderEditForm));




module.exports =router;
