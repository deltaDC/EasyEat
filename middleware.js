import { foodStoreSchema, reviewSchema } from "./schemas.js"
import ExpressError from "./utils/ExpressError.js"
import FoodStore from "./models/foodStore.js"
import Review from "./models/review.js"

export const isLoggedIn = (req, res, next) => {
    // passportjs
    if (!req.isAuthenticated()) {
        req.flash('error', "you have to be logged in")
        req.session.returnTo = req.originalUrl
        return res.redirect("/login")
    }
    next()
}

export const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// validating data before passing it to db
export const validatedFoodStore = (req, res, next) => {
    const { error } = foodStoreSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// check author of store post
export const isAuthor = async (req, res, next) => {
    const { id } = req.params
    const store = await FoodStore.findById(id)
    // check the author of the store and the logged in user
    if (!store.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that")
        return res.redirect(`/foodstores/${id}`)
    }
    next()
}

// validating reviews before passing it to db
export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

export const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    // check the author of the store and the logged in user
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do that")
        return res.redirect(`/foodstores/${id}`)
    }
    next()
}
