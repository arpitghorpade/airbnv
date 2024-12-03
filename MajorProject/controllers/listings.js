const Listing = require("../models/listing.js");



module.exports.index = async (req , res) =>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings})
 };

 module.exports.renderNewForm = async(req, res) =>{
    //console.log(req.user);
   
     res.render("listings/new.ejs");
 };

 module.exports.showListing =async(req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",
       populate :{
           path : "author",
       },}).populate("owner");
    if(!listing){
       req.flash("error", "Requested Listing does not exists!");
       res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res, next) =>{
    // let { title, description , image , price, country , location } = req.body;
    // let listing = req.body.listing;
    
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     await newListing.save();
    // console.log(listing);
    req.flash("success", "New Listing Created!");
     res.redirect("/listings");
 };

 module.exports.editListing = async  (req, res) =>{
    let { id } =req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Listing Edited Successfully!");
    if(!listing){
        req.flash("error", "Requested Listing does not exists!");
        res.redirect("/listings");
     }
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    // if (!listing.owner.equals(req.user._id)) {
    //     req.flash("error", "You don't have permission to update this listing.");
    //     return res.redirect(`/listings/${id}`);
    // }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
} ;

module.exports.destroyListing = async(req, res) =>{
    let { id } =req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success", "Listing Deleted Succesfully!");
   res.redirect("/listings");
};
