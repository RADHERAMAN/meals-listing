import { useEffect, useState } from "react";
import "./App.css";
import MealCard from "./components/MealCard";

function App() {
  const [meals, setMeals] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [area, setArea] = useState("All");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [darkMode, setDarkMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    async function getMeals() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.freeapi.app/api/v1/public/meals?page=${page}&limit=10`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }

        const data = await response.json();

        setMeals(data.data.data);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getMeals();
  }, [page]);

  const categories = [
    "All",
    ...new Set(meals.map((meal) => meal.strCategory)),
  ];

  const areas = [
    "All",
    ...new Set(meals.map((meal) => meal.strArea)),
  ];

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.strMeal
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || meal.strCategory === category;

    const matchesArea =
      area === "All" || meal.strArea === area;

    return matchesSearch && matchesCategory && matchesArea;
  });

  return (
    <div className={darkMode ? "app dark" : "app"}>

      {/* Header */}

      <header className="header">
        <div>
          <h1>🍽️ Meals & Recipes</h1>
          <p>
            Discover delicious recipes from around the world
          </p>
        </div>

        <button
          className="theme-button"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <main>

        {/* Search */}

        <div className="search-container">
          <input
            type="text"
            placeholder="Search meals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}

        <div className="filter-section">
          <h3>Categories</h3>

          <div className="category-container">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={category === item ? "active" : ""}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Areas */}

        <div className="filter-section">
          <h3>Areas</h3>

          <div className="category-container">
            {areas.map((item) => (
              <button
                key={item}
                onClick={() => setArea(item)}
                className={area === item ? "active" : ""}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <p className="status">
            Loading meals...
          </p>
        )}

        {/* Error */}

        {error && (
          <p className="status error">
            {error}
          </p>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          filteredMeals.length === 0 && (
            <p className="status">
              No meals found.
            </p>
          )}

        {/* Meals */}

        {!loading &&
          !error &&
          filteredMeals.length > 0 && (
            <div className="meal-grid">
              {filteredMeals.map((meal) => (
                <MealCard
                  key={meal.idMeal}
                  meal={meal}
                  onViewRecipe={() =>
                    setSelectedMeal(meal)
                  }
                />
              ))}
            </div>
          )}

        {/* Pagination */}

        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            ← Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>

      </main>

      {/* Recipe Modal */}

      {selectedMeal && (
        <div className="recipe-modal">

          <div className="recipe-modal-content">

            <button
              className="close-button"
              onClick={() => setSelectedMeal(null)}
            >
              ✕
            </button>

            <img
              src={selectedMeal.strMealThumb}
              alt={selectedMeal.strMeal}
            />

            <h2>{selectedMeal.strMeal}</h2>

            <p>
              <strong>Category:</strong>{" "}
              {selectedMeal.strCategory}
            </p>

            <p>
              <strong>Area:</strong>{" "}
              {selectedMeal.strArea}
            </p>

            {/* Ingredients */}

            <h3>Ingredients</h3>

            <ul>
              {Array.from(
                { length: 20 },
                (_, index) => {
                  const ingredient =
                    selectedMeal[
                      `strIngredient${index + 1}`
                    ];

                  const measure =
                    selectedMeal[
                      `strMeasure${index + 1}`
                    ];

                  if (!ingredient) {
                    return null;
                  }

                  return (
                    <li key={index}>
                      {measure} {ingredient}
                    </li>
                  );
                }
              )}
            </ul>

            {/* Instructions */}

            <h3>Instructions</h3>

            <p className="instructions">
              {selectedMeal.strInstructions}
            </p>

            {/* YouTube */}

            {selectedMeal.strYoutube && (
              <a
                href={selectedMeal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-button"
              >
                ▶ Watch on YouTube
              </a>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default App;