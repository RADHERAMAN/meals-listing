function MealCard({ meal, onViewRecipe }) {
  return (
    <div className="meal-card">

      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="meal-image"
      />

      <div className="meal-content">

        <h2>{meal.strMeal}</h2>

        <p>
          <strong>Category:</strong>{" "}
          {meal.strCategory}
        </p>

        <p>
          <strong>Area:</strong>{" "}
          {meal.strArea}
        </p>

        <button onClick={onViewRecipe}>
          View Recipe
        </button>

      </div>

    </div>
  );
}

export default MealCard;