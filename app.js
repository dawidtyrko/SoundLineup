// app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const artistRoutes = require('./routes/artistRoutes');
const groupRoutes = require('./routes/groupRoutes');
const localRoutes = require('./routes/localRoutes');
const offerRoutes = require('./routes/offerRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

// Connect to MongoDB, MONGO_URI set in .env
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    });


app.use('/api/artists', artistRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/locals', localRoutes);
app.use('/api/offers', offerRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
});
