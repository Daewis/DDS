
import express from 'express';
import path from 'path';
import cors from 'cors';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import db from './db.js';

//const apiRoutes = require('./routes/api');
import apiRoute from "./route/api.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// api
app.use('/api', apiRoute);

// fallback for SPA or direct file requests
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  return res.status(404).json({message: "The requested endpoint could not be found!"})
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});


