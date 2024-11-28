const express = require("express");
const mongoose = require("mongoose");
const RecipesModel = require("../models/Recipes"); 
const UserModel = require("../models/User"); 
const router = express.Router();

router.get("/", async (req, res) => {
  const { search, category, tags } = req.query;
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  if (tags) {
    query.tags = { $in: tags.split(",") };
  }

  try {
    const recipes = await RecipesModel.find(query);
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post("/create", async (req, res) => {
  const { name, imageUrl, ingredients, instructions ,description, cookingTime, category, tags } = req.body;

  try {
    const recipe = new RecipesModel({
      _id: new mongoose.Types.ObjectId(),
      name,
      imageUrl,
      description,
      ingredients,
      instructions,
      cookingTime,
      category,
      tags,
    });

    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        imageUrl: result.imageUrl,
        ingredients: result.ingredients,
        instructions: result.instructions,
        cookingTime: result.cookingTime,
        category: result.category,
        tags: result.tags,
        _id: result._id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/save", async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe._id);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(200).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.status(200).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;