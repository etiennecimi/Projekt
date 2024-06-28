const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Express app
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Dient statische Dateien aus dem "public"-Ordner aus

// verbindet die anwendung mit datenbank namens kalorientracker auf localhost27017
mongoose.connect('mongodb://localhost:27017/kalorientracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB-Verbindungsfehler:'));
db.once('open', () => {
  console.log('Verbunden mit MongoDB');
});

// definiert ein gericht mit meal und calories
const mealSchema = new mongoose.Schema({
  meal: String,
  calories: Number,
});

const Meal = mongoose.model('Meal', mealSchema);

// einfache route die begrüßungsnachricht zurüchgibt
app.get('/', (req, res) => {
  res.send('Kalorientracker API');
});

// alle gerichte abfragen
app.get('/meals', async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).send(err);
  }
});

// gericht adden miut POST
app.post('/meals', async (req, res) => {
  const meal = new Meal(req.body);
  try {
    const savedMeal = await meal.save();
    res.json(savedMeal);
  } catch (err) {
    res.status(400).send(err);
  }
});

// gericht löschen mit DELETE
app.delete('/meals/:id', async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    const meals = await Meal.find(); // Die aktualisierte Liste der verbleibenden Gerichte abrufen
    res.json(meals); // Die Liste zurückgeben
  } catch (err) {
    res.status(500).send(err);
  }
});
// server starten mit console nachricht
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
