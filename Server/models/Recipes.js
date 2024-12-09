const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  imageUrl: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  category: { type: String, required: true },
  tags: { type: [String]},
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;