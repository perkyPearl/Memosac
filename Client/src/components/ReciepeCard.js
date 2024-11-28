import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.imageUrl} alt={recipe.name} className="recipe-card-image" />
      <div className="recipe-card-content">
        <h3>{recipe.name}</h3>
        <p>{recipe.description}</p>
        <p>Category: {recipe.category}</p>
        <p>Tags: {recipe.tags.join(", ")}</p>
        <Link to={`/recipes/${recipe._id}`} className="recipe-card-link">
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;