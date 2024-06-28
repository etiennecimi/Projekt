// header footer main erstellen und alle meals loaden
document.addEventListener('DOMContentLoaded', () => {
    createHeader();
    createMainContent();
    createFooter();
    loadMeals();
  });
  // überschrift
  function createHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `<h1>Kalorientracker</h1>`;
  }
  // main -> erstellt eingabe feld, button, etc
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
  
    document.getElementById('meal-form').addEventListener('submit', addMeal);
  }
  // footer mit copyright zeichen
  function createFooter() {
    const footer = document.getElementById('footer');
    footer.innerHTML = `<p>&copy; 2024 Kalorientracker</p>`;
  }
  // sammelt eingegegene Daten von gericht  und kalorien schhickt an server und lädt dann neu
  async function addMeal(event) {
    event.preventDefault();
    const mealInput = document.getElementById('meal');
    const caloriesInput = document.getElementById('calories');
  
    const meal = mealInput.value;
    const calories = parseInt(caloriesInput.value);
  
    if (meal && calories) {
        const response = await fetch('http://localhost:3000/meals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ meal, calories })
        });
  
        if (response.ok) {
            mealInput.value = '';
            caloriesInput.value = '';
            loadMeals(); // Lade die Mahlzeiten erneut nach dem Hinzufügen einer neuen Mahlzeit
        } else {
            console.error('Fehler beim Hinzufügen der Mahlzeit');
        }
    }
  }
  // ruft alle gespeicherten gerichte vom server ab und lädt sie
  async function loadMeals() {
    const response = await fetch('http://localhost:3000/meals');
    if (response.ok) {
        const meals = await response.json();
        updateMealList(meals);
        updateTotalCalories(meals);
    } else {
        console.error('Fehler beim Laden der Mahlzeiten');
    }
  }
  // aktualisiert liste im frontend
  function updateMealList(meals) {
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = '';
  
    meals.forEach((item) => {
      const li = document.createElement('li');
      li.setAttribute('data-id', item._id); // Add this line
      li.textContent = `${item.meal} - ${item.calories} kcal`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Löschen';
      deleteButton.addEventListener('click', () => deleteMeal(item._id));
      li.appendChild(deleteButton);
      mealList.appendChild(li);
    });
  }
  // kalorienrechner
  function updateTotalCalories(meals) {
    const totalCalories = document.getElementById('total-calories');
    const total = meals.reduce((sum, item) => sum + item.calories, 0);
    totalCalories.textContent = total;
  }
  // löscht ein gericht und aktualisiert die kalorien und gerichtliste
  async function deleteMeal(id) {
    // Versuch, die Mahlzeit vom Server zu löschen
    const response = await fetch(`http://localhost:3000/meals/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        // Aktualisierte Liste der Mahlzeiten vom Server erhalten
        const meals = await response.json();
        // Liste der Mahlzeiten im Frontend aktualisieren
        updateMealList(meals);
        // Gesamtkalorien im Frontend aktualisieren
        updateTotalCalories(meals);
    } else {
        console.error('Fehler beim Löschen der Mahlzeit');
        // Wenn das Löschen fehlschlägt, lade die Mahlzeiten neu, um die Konsistenz der UI zu gewährleisten
        loadMeals();
    }
}

  