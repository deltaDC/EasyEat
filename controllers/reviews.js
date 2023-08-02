import FoodStore from "../models/foodStore.js"
import Review from "../models/review.js"

import catchAsync from "../utils/catchAsync.js"
import moment from 'moment/moment.js'


export const postReview = catchAsync(async (req, res, next) => {
    // find store and create a new review from review form
    const store = await FoodStore.findById(req.params.id)
    const review = new Review(req.body.review)

    // set author of review
    review.author = req.user._id
    // set createdAt property of review
    review.createdAt = moment().format("DD-MM-YYYY hh:mm:ss")
    // push to store schema and save review
    store.reviews.push(review)
    await review.save()
    await store.save()
    req.flash('success', "Created review")
    res.redirect(`/foodstores/${store._id}`)
})

export const deleteReview = catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params

    // delete the reference of review from the foodstore collection
    await FoodStore.findByIdAndUpdate(id, {
        // pull out the reviewId from the reviews array
        $pull: {
            reviews: reviewId
        }
    })

    // delete the review from review collection
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', "successfully deleted review")
    res.redirect(`/foodstores/${id}`)
})