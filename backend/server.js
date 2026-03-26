require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const creatorRoutes = require('./routes/creatorRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
connectDB();

// API Routes
app.use('/api/creator', creatorRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send('API running...');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
// Restart triggered by system
