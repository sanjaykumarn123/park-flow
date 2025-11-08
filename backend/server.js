const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const app = express();

// Middleware
app.use(express.json());

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Handle real-time parking updates
  });
});

// MongoDB connection
mongoose.connect('mongodb://localhost/parkflow', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.use('/api/parking', require('./routes/parking'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payments', require('./routes/payments'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
