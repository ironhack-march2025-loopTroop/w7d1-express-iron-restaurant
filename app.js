
const express = require("express")
const logger = require('morgan');

const pizzasArr = require("./data/pizzas")

const PORT = 3005;

const app = express()


// Make the static files inside of the `public/` folder publicly accessible
app.use(express.static("public"))

// Setup the request logger to run on each request
app.use(logger("dev"))


// JSON middleware to parse incoming HTTP requests that contain JSON    // <== ADD
app.use(express.json());



/**************************/
/* Examples of middleware */
/**************************/

function customMiddleware1(req, res, next){
    console.log("hello 1")
    next()
}

function customMiddleware2(req, res, next){
    console.log("hello 2")
    next()
}

app.use(customMiddleware1)
app.use(customMiddleware2)


/**********/
/* Routes */
/**********/

// app.get(path, code)
// app.get(path, function(request, response, next){})


// Some methods to send an http response:
// - res.send()
// - res.sendFile()
// - res.json()



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

    if (maxPrice === undefined) {
        res.json(pizzasArr)
        return;
    }

    const filteredPizzas = pizzasArr.filter((pizzaDetails) => {
        return pizzaDetails.price <= parseFloat(maxPrice);
    });

    res.json(filteredPizzas)
})



//
// GET /pizzas/:pizzaId
//
app.get("/pizzas/:pizzaId", function(req, res, next){

    let {pizzaId} = req.params;

    pizzaId = parseInt(pizzaId) // convert pizzaId to a number 
    
    const result = pizzasArr.find((pizzaDetails) => {
        return pizzaDetails.id === pizzaId;
    })
    
    res.json(result);
})




app.listen(PORT, function () {
    console.log(`App is listening for requests on port ${PORT}...`)
})
