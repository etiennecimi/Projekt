const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// express app
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// connenction zu Mongodb
mongoose.connect('mongodb://localhost:27017/kalorientracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB-Verbindungsfehler:'));
db.once('open', () => {
  console.log('Verbunden mit MongoDB');
});

// schema und modell erstellen 
const mealSchema = new mongoose.Schema({
  meal: String,
  calories: Number,
});

const Meal = mongoose.model('Meal', mealSchema);

// nachfragen bei Praktikum 
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

// gericht hinzufügen
app.post('/meals', async (req, res) => {
  const meal = new Meal(req.body);
  try {
    const savedMeal = await meal.save();
    res.json(savedMeal);
  } catch (err) {
    res.status(400).send(err);
  }
});

// gericht löschen
app.delete('/meals/:id', async (req, res) => {
  try {
    const deletedMeal = await Meal.findByIdAndRemove(req.params.id);
    if (!deletedMeal) {
      return res.status(404).send('Meal not found');
    }
    res.json(deletedMeal);
  } catch (err) {
    res.status(500).send(err);
  }
});

// server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});