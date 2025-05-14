
const express = require("express")
const mongoose = require("mongoose");
const logger = require('morgan');

const Pizza = require("./models/Pizza.model")
const Cook = require("./models/Cook.model")

const PORT = 3005;

const app = express()


// Make the static files inside of the `public/` folder publicly accessible
app.use(express.static("public"))

// Setup the request logger to run on each request
app.use(logger("dev"))


// JSON middleware to parse incoming HTTP requests that contain JSON    // <== ADD
app.use(express.json());


/*********************/
/* Connect to the DB */
/*********************/

mongoose
    .connect("mongodb://127.0.0.1:27017/express-restaurant")
    .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error("Error connecting to mongo", err));

mongoose.set('runValidators', true); // turn on schema validation for all updates

/**************************/
/* Examples of middleware */
/**************************/

function customMiddleware1(req, res, next) {
    console.log("hello 1")
    next()
}

function customMiddleware2(req, res, next) {
    console.log("hello 2")
    next()
}

app.use(customMiddleware1)
app.use(customMiddleware2)


/**********/
/* Routes */
/**********/

//
// GET /
//
app.get("/", function (req, res, next) {
    res.sendFile(__dirname + "/views/home.html")
})


//
// GET /contact
//
app.get("/contact", function (req, res, next) {
    res.sendFile(__dirname + "/views/contact-page.html")
})


//
// GET /pizzas
// GET /pizzas?maxPrice=15
//
app.get("/pizzas", function (req, res, next) {

    const { maxPrice } = req.query;

    let filter = {}

    if (maxPrice !== undefined) {
        filter = { price: { $lte: maxPrice } }
    }

    Pizza.find(filter)
        .populate("cook")
        .then((pizzasFromDB) => {
            res.json(pizzasFromDB)
        })
        .catch(error => {
            console.log("Error getting pizzas from DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to get list of pizzas" });
        });
})



//
// GET /pizzas/:pizzaId
//
app.get("/pizzas/:pizzaId", function (req, res, next) {

    const { pizzaId } = req.params;

    Pizza.findById(pizzaId)
        .populate("cook")
        .then((pizzaFromDB) => {
            res.json(pizzaFromDB)
        })
        .catch(error => {
            console.log("Error getting pizza details from DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to get pizza details" });
        });
})



// POST /pizzas
app.post("/pizzas", function (req, res, next) {

    const newPizza = req.body;

    Pizza.create(newPizza)
        .then((pizzaFromDB) => {
            res.status(201).json(pizzaFromDB)
        })
        .catch((error) => {
            console.log("Error creating a new pizza in the DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to create a new pizza" });
        })
})



//
// PUT /pizzas/:pizzaId
//
app.put("/pizzas/:pizzaId", function (req, res, next) {

    const { pizzaId } = req.params;

    const newDetails = req.body;

    Pizza.findByIdAndUpdate(pizzaId, newDetails, { new: true })
        .then((pizzaFromDB) => {
            res.json(pizzaFromDB)
        })
        .catch((error) => {
            console.error("Error updating pizza...");
            console.error(error);
            res.status(500).json({ error: "Failed to update a pizza" });
        });
})



//
// DELETE /pizzas/:pizzaId
//
app.delete("/pizzas/:pizzaId", function (req, res, next) {

    const { pizzaId } = req.params;

    Pizza.findByIdAndDelete(pizzaId)
        .then(response => {
            res.json(response)
        })
        .catch((error) => {
            console.error("Error deleting pizza...");
            console.error(error);
            res.status(500).json({ error: "Failed to delete a pizza" });
        });
})



//
// POST /cooks
//
app.post("/cooks", function (req, res, next) {

    const newCook = req.body;

    Cook.create(newCook)
        .then((cookFromDB) => {
            res.status(201).json(cookFromDB)
        })
        .catch(error => {
            console.log("Error creating a new cook in the DB...");
            console.log(error);
            res.status(500).json({ error: "Failed to create a new cook" });
        });
})




app.listen(PORT, function () {
    console.log(`App is listening for requests on port ${PORT}...`)
})
