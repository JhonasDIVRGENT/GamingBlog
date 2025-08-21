// Entry point for the application
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('./config/logger');
const { requestLogger, errorLogger, slowRequestLogger, authLogger, crudLogger } = require('./middleware/logging');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware
app.use(requestLogger);
app.use(slowRequestLogger(2000)); // Log requests que tomen más de 2 segundos
app.use(authLogger);
app.use(crudLogger);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure blog routes are properly registered
const blogRoutes = require('./controllers/blogController');
app.use('/blog', blogRoutes);

// Redirect root to /blog
app.get('/', (req, res) => {
    res.redirect('/blog');
});

// Error handling middleware (debe ir antes del listen)
app.use(errorLogger);

// Server
const PORT = 3000;
app.listen(PORT, () => {
    logger.info(`Server started successfully`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
    console.log(`Server running on http://localhost:${PORT}`);
});
