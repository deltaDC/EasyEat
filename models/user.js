import mongoose from "mongoose"
import passportLocalMongoose from "passport-local-mongoose"
const { Schema } = mongoose

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// simplifies building username and password login with Passport
// https://www.npmjs.com/package/passport-local-mongoose
UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', UserSchema)
export default User