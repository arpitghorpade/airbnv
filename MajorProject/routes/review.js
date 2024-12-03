const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview , isReviewAuthor,isLoggedIn} = require("../middleware.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



//POST Review Route

router.post("/", isLoggedIn , validateReview , wrapAsync(async(req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    console.log(newReview.author)
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}))

//Delete Review Route

router.delete("/:reviewId",isLoggedIn , isReviewAuthor , wrapAsync(async (req, res)=>{
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {pull :{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
   console.log("deleted review")
   req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`)
}));


module.exports = router;