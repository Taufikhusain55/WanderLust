const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: "https://media.istockphoto.com/id/2214640572/photo/tropical-sea-beach-natural-background-with-blue-sky-palm-trees-and-white-clouds-in-blue-sky.jpg?s=1024x1024&w=is&k=20&c=Kgh9mnU8D_VYyWiNky0DBdwXs7JRUX1CLXNjtFVizZ8=",
            set: (v) => v === "" ? "https://media.istockphoto.com/id/2214640572/photo/tropical-sea-beach-natural-background-with-blue-sky-palm-trees-and-white-clouds-in-blue-sky.jpg?s=1024x1024&w=is&k=20&c=Kgh9mnU8D_VYyWiNky0DBdwXs7JRUX1CLXNjtFVizZ8=" : v,
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
    {
        type: Schema.Types.ObjectId,
        ref: "Review",
    }
    ],
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;