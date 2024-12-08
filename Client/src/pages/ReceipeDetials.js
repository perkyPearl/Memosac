import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/reciepe.css';

const RecipeDetail = () => {
  const { recipeId } = useParams(); 
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/recipes/${recipeId}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (!recipe) {
    return <p>Loading recipe...</p>;
  }

  return (
    <div className="recipe-detail">
      <h1>{recipe.name}</h1>
      <img src={recipe.imageUrl} alt={recipe.name} className="recipe-detail-image" />
      <div className="recipe-detail-content">
        <p><strong>Description:</strong> {recipe.description}</p>
        <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
        <p><strong>Category:</strong> {recipe.category}</p>
        <p><strong>Tags:</strong> {recipe.tags.join(", ")}</p>

        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <h2>Instructions</h2>
        <p>{recipe.instructions}</p>
      </div>
    </div>
  );
};

export default RecipeDetail;