import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/reciepe.css'; // Assuming you have a CSS file for styling

export default function ReceipeHome() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.category = selectedCategory;

        const response = await axios.get("http://localhost:4000/recipes", { params });
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, [searchQuery, selectedCategory]); // Re-fetch whenever searchQuery or selectedCategory changes

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCreateRecipe = () => {
    navigate('/create-recipe');
  };

  const handleRecipeClick = (id) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <div className="receipe-home-container">
      <div className="reciepe-flex">
        <input
          type="text"
          placeholder="Search recipes by title, tags, category, or ingredients..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select value={selectedCategory} onChange={handleCategoryChange} className="category-select">
          <option value="">All Categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snacks">Snacks</option>
        </select>
      </div>
      <div className="recipes-list">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="recipe-card" onClick={() => handleRecipeClick(recipe._id)}>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
          </div>
        ))}
      </div>
      <button className="floating-button" onClick={handleCreateRecipe}>
        +
      </button>
    </div>
  );
}
