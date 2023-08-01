import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { config as dotenvConfig } from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    // Load environment variables from .env
    dotenvConfig();
}

// console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET)

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'FoodStore',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

export {
    cloudinary,
    storage
}