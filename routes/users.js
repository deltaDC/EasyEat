import express from "express"
import { getLoginForm, getLogoutForm, getRegisterForm, postLoginForm, postRegisterForm } from "../controllers/users.js"
import passport from "passport"
import { storeReturnTo } from "../middleware.js"

const router = express.Router()

router.route("/register")
    // get register form
    .get(getRegisterForm)

    // create registration
    .post(postRegisterForm)

router.route("/login")
    // get login form
    .get(getLoginForm)

    // login
    .post(
        storeReturnTo,
        passport.authenticate(
            "local",
            {
                failureFlash: true,
                failureRedirect: "/login"
            }
        ),
        postLoginForm
    )

// logout 
router.get("/logout", getLogoutForm)


export default router