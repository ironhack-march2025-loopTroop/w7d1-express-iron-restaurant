const mongoose = require("mongoose")
const Schema = mongoose.Schema;


// we define our schema (the pattern that every document in this collection will follow)
const pizzaSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 99
    },
    isVeggie: {
        type: Boolean,
        default: false
    },
    ingredients: [String],
    dough: {
        type: String,
        enum: ["thin", "thick", "with garlic", "with cheese"]
    },
    cook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cook",
        required: true
    }
})


// we create our model (which we'll use to interact with the DB)
const Pizza = mongoose.model("Pizza", pizzaSchema)


module.exports = Pizza;

