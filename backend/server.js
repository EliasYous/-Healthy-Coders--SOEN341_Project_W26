const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');

const initDatabase = require('./config/dbinit');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const recipeRoutes = require('./routes/recipe');
const mealPlanRoutes = require('./routes/mealPlans');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Initialize database on startup
initDatabase().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/meal-plans', mealPlanRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MealMajor API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

