import mongoose from "mongoose"
import FoodStore from "../models/foodStore.js"
import { places, descriptors } from "./seedHelpers.js"
import cities from "./cities.js"
import moment from 'moment/moment.js'


// connect local mongodb
main().catch(err => console.log(err))
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/foodStore')
    console.log("mongodb connected successfully")
}

const sample = array => array[Math.floor(Math.random() * array.length)];

// fake data to db
const seedDB = async () => {
    await FoodStore.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const ranPrice = Math.floor(Math.random() * 100) + 1
        const store = new FoodStore({
            author: "64c2decb2ad8bd6a3900ce3d",
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: "some description description description description description description",
            price: ranPrice,
            images: [
                {
                    url: "https://res.cloudinary.com/de40tb8iq/image/upload/v1690750595/FoodStore/fgaerusmvxlyiw0njibs.jpg",
                    filename: "FoodStore/fgaerusmvxlyiw0njibs"
                },
                {
                    url: "https://res.cloudinary.com/de40tb8iq/image/upload/v1690750593/FoodStore/j9s7pkqkwvs48xzbdq5z.jpg",
                    filename: "FoodStore/j9s7pkqkwvs48xzbdq5z"
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            createdAt: moment().format("DD-MM-YYYY HH:mm:ss")
        })
        await store.save()
    }
}

// call to get fake data and close connection
seedDB()
    .then(() => {
        mongoose.connection.close()
    })