import express from "express"
import { getFoodStores, getFoodStore, getFoodStoreForm, postFoodStoreForm, getEditForm, updateFoodStore, deleteFoodStore } from "../controllers/foodstores.js"
import { isAuthor, isLoggedIn, validatedFoodStore } from "../middleware.js"
import multer from "multer" // to parse multipart/form-data
import { storage } from "../cloudinary/index.js"


const upload = multer({ storage })

const router = express.Router()

router.route("/")
    // get all food stores
    .get(getFoodStores)

    // create a new food store
    .post(isLoggedIn, upload.array("image"), validatedFoodStore, postFoodStoreForm)


// get a form to create a new store
router.get("/new", isLoggedIn, getFoodStoreForm)

router.route("/:id")
    // get one food store
    .get(getFoodStore)

    // update a food store
    .put(isLoggedIn, isAuthor, upload.array("image"), validatedFoodStore, updateFoodStore)

    // delete a food store
    .delete(isLoggedIn, isAuthor, deleteFoodStore)

// get edit form of a food store
router.get("/:id/edit", isLoggedIn, isAuthor, getEditForm)


export default router
