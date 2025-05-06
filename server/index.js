import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import propertyRoutes from './routes/propertyRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Initialize Express app
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection (uncomment when you have MongoDB set up)
mongoose.connect('mongodb://localhost:27017/housefinder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('House Finder API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});