require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = () => {
  mongoose
    .connect(("mongodb+srv://ravisharmabhimtal:collage1234@hgscollage.bw8mb5h.mongodb.net/?retryWrites=true&w=majority&appName=hgscollage"), { useNewUrlParser: true })
    .then(() => {
      console.log("Connected to MongoDB Successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB", error);
    });
};

module.exports = connectToMongo;
