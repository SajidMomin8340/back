import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, mongoDBURL } from './config.js';
import itemsRoute from './routes/itemsRoute.js';
import companyrouter from './routes/companyrouter.js';

const app = express();

app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: 'https://front-kkcb.onrender.com', // Allow requests only from your frontend domain
  methods: 'GET,POST,PUT,DELETE,OPTIONS', // Specify allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization' // Specify allowed headers
}));

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Visa Chemical');
});

app.use('/items', itemsRoute);
app.use('/company', companyrouter);

mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});
