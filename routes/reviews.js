import express from "express"
import { deleteReview, postReview } from "../controllers/reviews.js"
import { validateReview, isLoggedIn, isReviewAuthor } from "../middleware.js"



const router = express.Router({ mergeParams: true })

// post a review
router.post("/", isLoggedIn, validateReview, postReview)

// delete a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, deleteReview)

export default router

