const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: String,
    ingredientString: String,
    ingredients:[], //Holds IDs of any sub ingredients 
    allergy: [String]
});

module.exports = ingredientSchema;