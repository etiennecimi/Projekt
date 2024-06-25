
document.addEventListener('DOMContentLoaded', () => {
    createHeader();
    createMainContent();
    createFooter();
    loadMeals();
});

// header
function createHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `<h1>Kalorientracker</h1>`;
}

// hauptinhalt der seite
function createMainContent() {
    const mainContent = document.getElementById('main-content');

    const mealSection = document.createElement('section');
    mealSection.innerHTML = `
        <h2>Mahlzeit hinzufügen</h2>
        <form id="meal-form">
            <label for="meal">Gericht:</label>
            <input type="text" id="meal" name="meal" required>
            <label for="calories">Kalorien:</label>
            <input type="number" id="calories" name="calories" required>
            <button type="submit">Hinzufügen</button>
        </form>
    `;
    mainContent.appendChild(mealSection);

    const summarySection = document.createElement('section');
    summarySection.innerHTML = `
        <h2>Tageszusammenfassung</h2>
        <p>Gesamtkalorien heute: <span id="total-calories">0</span></p>
        <ul id="meal-list"></ul>
    `;
    mainContent.appendChild(summarySection);

    // Event Listener für das Hinzufügen von Mahlzeiten
    document.getElementById('meal-form').addEventListener('submit', addMeal);
}

// footerbereich
function createFooter() {
    const footer = document.getElementById('footer');
    footer.innerHTML = `<p>&copy; 2024 Kalorientracker</p>`;
}

//gericht hinzufügen
function addMeal(event) {
    event.preventDefault();
    const mealInput = document.getElementById('meal');
    const caloriesInput = document.getElementById('calories');

    const meal = mealInput.value;
    const calories = parseInt(caloriesInput.value);

    if (meal && calories) {
        const meals = getMealsFromStorage();
        meals.push({ meal, calories });
        localStorage.setItem('meals', JSON.stringify(meals));

        mealInput.value = '';
        caloriesInput.value = '';

        updateMealList();
        updateTotalCalories();
    }
}

// lädt die mahlzeiten
function loadMeals() {
    updateMealList();
    updateTotalCalories();
}

// updated die Gerichte
function updateMealList() {
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = '';

    const meals = getMealsFromStorage();
    meals.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.meal} - ${item.calories} kcal`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.addEventListener('click', () => deleteMeal(index));
        li.appendChild(deleteButton);
        mealList.appendChild(li);
    });
}

// updaten der gesamtkalorien
function updateTotalCalories() {
    const totalCalories = document.getElementById('total-calories');
    const meals = getMealsFromStorage();
    const total = meals.reduce((sum, item) => sum + item.calories, 0);
    totalCalories.textContent = total;
}

// gericht löschen
function deleteMeal(index) {
    const meals = getMealsFromStorage();
    meals.splice(index, 1);
    localStorage.setItem('meals', JSON.stringify(meals));

    updateMealList();
    updateTotalCalories();
}

// gespeicherte mahlzeiten aus lokalem storage  	
function getMealsFromStorage() {
    const meals = localStorage.getItem('meals');
    return meals ? JSON.parse(meals) : [];
}

