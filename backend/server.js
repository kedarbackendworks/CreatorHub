const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const creatorRoutes = require('./routes/creatorRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket.IO signaling handlers
require('./config/socket')(io);

// Make io accessible to route handlers if needed
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/creator', creatorRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/livestream', require('./routes/livestreamRoutes'));

app.get('/', (req, res) => {
  res.send('API running...');
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT} (HTTP + WebSocket)`);
});
