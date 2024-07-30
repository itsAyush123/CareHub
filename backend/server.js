require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 5000;


// Middleware
app.use(cors());
app.use(express.json());
var uri=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.ldsdorm.mongodb.net/${process.env.MONGO_DATABASE}`
// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected.');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/consultations', require('./routes/consultations'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/chat', require('./routes/chat'));

io.on('connection', (socket) => {
  // Listen for 'message' event from clients
  socket.on('message', (newMessage) => {
    // Emit the 'message' event to all connected clients
    io.emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    
  });
});


// Start the server
server.listen(process.env.PORT || 5000 ,() => {
  console.log(`Server started on port ${port}`);
});


