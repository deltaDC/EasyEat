import { config as dotenvConfig } from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    // Load environment variables from .env
    dotenvConfig();
}

import express from "express"
import mongoose from "mongoose"
import path from "path"
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import foodRoutes from "./routes/foodstores.js"
import reviewRoutes from "./routes/reviews.js"
import userRoutes from "./routes/users.js"
import methodOverride from "method-override"
import ejsMate from "ejs-mate"
import ExpressError from "./utils/ExpressError.js"
import session from "express-session"
import flash from "connect-flash"
import passport from "passport"
import LocalStrategy from "passport-local"
import User from "./models/user.js"
import mongoSanitize from "express-mongo-sanitize"
import helmet from "helmet"
import MongoStore from 'connect-mongo'


// replicate to use __dirname https://stackoverflow.com/questions/64383909/dirname-is-not-defined-error-in-node-14-version
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


// CONNECT MONGODB
// mongodb atlas url
const dbUrl = process.env.DB_URL
// local mongodb 'mongodb://127.0.0.1:27017/foodStore' process.env.DB_URL
const databaseName = "foodStore"
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName // Pass the database name here
}
main().catch(err => console.log(err))
async function main() {
    await mongoose.connect(dbUrl, options)
    console.log(`Connected to database: ${databaseName}`)
}

const app = express()


// use ejsMate
app.engine("ejs", ejsMate)


// parse json req
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// set view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


// use method overide npm to use put and delete method which browsers don't support
app.use(methodOverride("_method"))


// to use static assets
app.use(express.static(path.join(__dirname, 'public')))

// use express-mongo-sanitize to prevent mongo injection
app.use(mongoSanitize())

// mongodbstore to store session in production
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'somesecret'
    }
})
store.on("error", e => console.log("session store error", e))


// to use session to store data like cookies but in server-side
const sessionConfig = {
    store,
    name: "somepdccookie",
    secret: "somesecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))


// using flash to popup a notification
app.use(flash())

// using helmet helps secure Express apps by setting HTTP response headers
app.use(helmet({
    contentSecurityPolicy: false
}))


// using passportjs to authenticate
app.use(passport.initialize())
app.use(passport.session())
/*
authenticate() Generates a function that is used in Passport's LocalStrategy
serializeUser() Generates a function that is used by Passport to serialize users into the session
deserializeUser() Generates a function that is used by Passport to deserialize users into the session
*/
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// middleware for flash notifications
app.use((req, res, next) => {
    // using passport when login, it automatically add req.user and set it globally to access from all views
    res.locals.currentUser = req.user
    // res.locals allows to pass data from the server-side to the client-side
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


// routes
app.get('/', (req, res) => {
    res.render("home")
})
app.use("/foodstores", foodRoutes)
app.use('/foodstores/:id/reviews', reviewRoutes)
app.use("/", userRoutes)

// when all routes are not defined
app.all("*", (req, res, next) => {
    next(new ExpressError("page not found", 404))
})

// error middleware routes when facing errors
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "something went wrong" } = err
    res.status(statusCode).render("error", { err })
})


app.listen(3000, () => {
    console.log("listening on port 3000")
})