const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

// New route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash(
        "error",
        "The listing which you are trying to access ,is not exists !!",
      );
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }),
);

// Create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Sucessfully added new listing");
    res.redirect("/listings");
  }),
);

// Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const updatedListing = await Listing.findById(id);
    if (!updatedListing) {
      req.flash(
        "error",
        "The listing which you are trying to access ,is not exists !!",
      );
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { updatedListing });
  }),
);

// Update Route
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const newData = req.body.listing;
    await Listing.findByIdAndUpdate(id, newData);
    req.flash("success", "Listing Updated successfully");
    res.redirect(`/listings/${id}`);
  }),
);

//Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted !");
    res.redirect("/listings");
  }),
);

module.exports = router;
