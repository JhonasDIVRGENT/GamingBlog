// Entry point for the application
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const blogRoutes = require('./controllers/blogController');
app.use('/blog', blogRoutes);

// Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
