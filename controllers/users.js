import User from "../models/user.js"
import catchAsync from "../utils/catchAsync.js"

export const getRegisterForm = (req, res, next) => {
    res.render("users/register")
}

export const postRegisterForm = catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        // passportjs gives register() function to register new user
        const registeredUser = await User.register(user, password)
        // auto login after registration
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', "new user registered")
            res.redirect("/foodstores")
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect("/register")
    }
})

export const getLoginForm = (req, res, next) => {
    res.render("users/login")
}

export const postLoginForm = (req, res, next) => {
    req.flash("success", "you have logged in")
    const redirectUrl = res.locals.returnTo || '/foodstores'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

export const getLogoutForm = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        req.flash('success', 'you have logged out')
        res.redirect('/foodstores')
    })
}