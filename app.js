
const express = require("express")
const mongoose = require("mongoose");
const logger = require('morgan');

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




/****************/
/* Mount routes */
/****************/

app.use("/", require("./routes/pizza.routes"))
app.use("/", require("./routes/cook.routes"))



app.listen(PORT, function () {
    console.log(`App is listening for requests on port ${PORT}...`)
})
