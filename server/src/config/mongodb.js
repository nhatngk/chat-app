const mongoose = require("mongoose");
require("dotenv").config();

const connectMongo = async () => {
    await mongoose.connect(process.env.MONGODB_URI, {

    })
        .then(() => {
            console.log("Connect to MongoDB successfully!");
        })
        .catch(() => {
            console.log("Must connect to DB first!");
            process.exit(0);
        })
}
module.exports = connectMongo;