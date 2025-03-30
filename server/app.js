const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRouters');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
// const errorHandler = require('./middleware/errorHandler');

const app = express();

// // Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/chat', chatRoutes);

// Error handling middleware
// app.use(errorHandler);

module.exports = app;