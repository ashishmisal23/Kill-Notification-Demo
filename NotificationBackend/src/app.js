require('express-async-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const notificationRoutes = require('./routes/notificationRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Basic production readiness
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

// Serve static frontend assets from /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve API routes under /api
app.use('/api', notificationRoutes);

// Fallback for SPA or root — serve index.html
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(errorHandler);

module.exports = app;
