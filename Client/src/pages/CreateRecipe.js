import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "../styles/reciepe.css";

export const CreateRecipe = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const userID = userInfo?.id;

  const [recipe, setRecipe] = useState({
    name: "Spaghetti Carbonara",   // Default name
    description: "A classic Italian pasta dish",  // Default description
    ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan cheese"],  // Default ingredients
    instructions: "Cook pasta, fry pancetta, mix with eggs and cheese.",  // Default instructions
    imageUrl: "https://example.com/spaghetti-carbonara.jpg",  // Default image URL
    cookingTime: 30,  // Default cooking time (in minutes)
    category: "Dinner",  // Default category
    author: userID,
    tags: ["Italian", "Pasta", "Main Course"],  // Default tags
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    const ingredients = [...recipe.ingredients, ""];
    setRecipe({ ...recipe, ingredients });
  };

  const handleCategoryChange = (event) => {
    setRecipe({ ...recipe, category: event.target.value });
  };

  const handleTagsChange = (event) => {
    const { value } = event.target;
    const tagsArray = value.split(",").map(tag => tag.trim()); // Split by comma and trim whitespace
    setRecipe({ ...recipe, tags: tagsArray });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:4000/recipes/create",
        { ...recipe },
      );

      alert("Recipe Created");
      navigate("/recipes");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
        />

        {/* Description */}
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={recipe.description}
          onChange={handleChange}
        ></textarea>

        {/* Ingredients */}
        <label htmlFor="ingredients">Ingredients</label>
        {recipe.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            name="ingredients"
            value={ingredient}
            onChange={(event) => handleIngredientChange(event, index)}
          />
        ))}
        <button type="button" onClick={handleAddIngredient}>
          Add Ingredient
        </button>

        {/* Instructions */}
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
        ></textarea>

        {/* Image URL */}
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={recipe.imageUrl}
          onChange={handleChange}
        />

        {/* Cooking Time */}
        <label htmlFor="cookingTime">Cooking Time (minutes)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
        />

        {/* Category */}
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={recipe.category}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Snack">Snack</option>
        </select>

        {/* Tags */}
        <br />
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={recipe.tags.join(", ")}
          onChange={handleTagsChange}
        />

        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
};