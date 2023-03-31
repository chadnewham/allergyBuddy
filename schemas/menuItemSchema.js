const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: String,
    ingredientString: String,
    allergy: [String]
});


module.exports = menuItemSchema;