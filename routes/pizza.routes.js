const router = require("express").Router();

const Pizza = require("../models/Pizza.model");


//
// GET /pizzas
// GET /pizzas?maxPrice=15
//
router.get("/pizzas", function (req, res, next) {

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
router.get("/pizzas/:pizzaId", function (req, res, next) {

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
router.post("/pizzas", function (req, res, next) {

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
router.put("/pizzas/:pizzaId", function (req, res, next) {

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
router.delete("/pizzas/:pizzaId", function (req, res, next) {

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




module.exports = router;
