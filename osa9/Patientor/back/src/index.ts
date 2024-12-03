import express from 'express';
const app = express();
app.use(express.json());

import diagnosesService from './services/diagnosesService';

const cors = require('cors');
app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  res.json(diagnosesService.getDiagnoses());
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});