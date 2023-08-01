import Review from "../models/review.js"
import FoodStore from "../models/foodStore.js"

import catchAsync from "../utils/catchAsync.js"
import ExpressError from "../utils/ExpressError.js"

import { cloudinary } from "../cloudinary/index.js"
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js"

const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })


export const getFoodStores = catchAsync(async (req, res, next) => {
    const stores = await FoodStore.find({})
    res.render("foodstores/index", { stores })
})

export const getFoodStore = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const store = await FoodStore.findById(id)
        // populate review of the store and its author of review
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        // populate author of the store
        .populate("author")
    // flash notification when store not found
    if (!store) {
        req.flash('error', "Couldn't find food store")
        return res.redirect("/foodstores")
    }
    res.render("foodstores/show", { store })
})

export const getFoodStoreForm = (req, res, next) => {
    res.render("foodstores/new")
}

export const postFoodStoreForm = catchAsync(async (req, res, next) => {
    // mapbox geocoding
    const geoData = await geocoder.forwardGeocode({
        query: req.body.foodstore.location,
        limit: 1
    }).send()

    // if (!req.body.foodstore) throw new ExpressError("invalid foodstore", 400)
    const newFoodStore = new FoodStore(req.body.foodstore)
    // set geometry properties
    newFoodStore.geometry = geoData.body.features[0].geometry
    // get files req by multer from cloudinary
    newFoodStore.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    // set author of newFoodStore, req.user is already set by passportjs whan logged in
    newFoodStore.author = req.user._id
    await newFoodStore.save()
    // console.log(newFoodStore)
    req.flash('success', "foodstore created successfully")
    res.redirect(`/foodstores/${newFoodStore._id}`)
})

export const getEditForm = catchAsync(async (req, res, next) => {
    // fetch the existing food store
    const store = await FoodStore.findById(req.params.id)

    // flash notification when store not found
    if (!store) {
        req.flash('error', "Couldn't find food store")
        return res.redirect("/foodstores")
    }
    res.render("foodstores/edit", { store })
})

export const updateFoodStore = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const updatedStore = await FoodStore.findByIdAndUpdate(id, req.body.foodstore)
    // take all updated images from multer and save them
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    updatedStore.images.push(...imgs)
    await updatedStore.save()
    // check if any images have been chosen to be deleted
    if (req.body.deleteImages) {
        // delete in cloudinary
        for (let filename of req.body.deleteImages) {
            try {
                await cloudinary.uploader.destroy(filename);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        // delete in mongdodb
        await updatedStore.updateOne({
            // pull out images where filenames is in deleteImages array and update store
            $pull: {
                images: {
                    filename: {
                        // from view passing through deleteImages array
                        $in: req.body.deleteImages
                    }
                }
            }
        })
    }
    req.flash('success', "update food store successfully")
    res.redirect(`/foodstores/${updatedStore._id}`)
})

export const deleteFoodStore = catchAsync(async (req, res, next) => {
    const { id } = req.params
    await FoodStore.findByIdAndDelete(id)
    req.flash('success', "successfully deleted foodstore")
    res.redirect(`/foodstores`)
})