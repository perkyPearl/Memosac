import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/ReciepeCard'; 
import { useNavigate } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Construct query parameters based on search, category, and tags
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedTags) params.tags = selectedTags;

        const response = await axios.get("http://localhost:4000/recipes", { params });
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, [searchQuery, selectedCategory, selectedTags]); // Re-fetch whenever these change

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleTagsChange = (event) => {
    setSelectedTags(event.target.value); // You can handle tags as comma-separated string
  };

  const navigate = useNavigate();

  const handleCreateRecipe = () => {
    navigate("/create-recipe");
  };

  return (
    <div className="recipe-list">
      <h1>Recipe List</h1>

      <button onClick={handleCreateRecipe} className="create-recipe-btn">
        Create New Recipe
      </button>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Category Filter */}
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Dessert">Dessert</option>
        <option value="Snack">Snack</option>
      </select>

      {/* Tags Filter */}
      <input
        type="text"
        placeholder="Filter by tags (comma-separated)..."
        value={selectedTags}
        onChange={handleTagsChange}
      />

      {recipes.length > 0 ? (
        <div className="recipe-card-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p>No recipes available</p>
      )}
    </div>
  );
};

export default RecipeList;
