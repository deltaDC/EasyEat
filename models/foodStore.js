// https://mongoosejs.com/docs/guide.html

import mongoose from "mongoose"
import Review from "./review.js"
import User from "./user.js"
const { Schema } = mongoose

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

// define imageSchema
const ImageSchema = new Schema({
    url: String,
    filename: String
})

// set virtual properties image with less pixel img to fetch faster (not store in db)
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

/*
By default, Mongoose does not include virtuals when you convert a 
document to JSON. For example, if you pass a document to Express' 
res.json() function, virtuals will not be included by default.

https://mongoosejs.com/docs/tutorials/virtuals.html#virtuals-in-json
*/
const opts = { toJSON: { virtuals: true } }

const FoodStoreSchema = new Schema({
    title: String,
    images: [ImageSchema],
    createdAt: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            // ref has to be the same as Review schema we import
            ref: "Review"
        }
    ]
}, opts)

// create virtual to nest data in properties key -> clusterMap default data structure
FoodStoreSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/foodstores/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
})

// delete all references (review) of foodstore when we delete foodstore
FoodStoreSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const FoodStore = mongoose.model('FoodStore', FoodStoreSchema)
export default FoodStore