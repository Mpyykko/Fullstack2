import express from 'express';
const app = express();
app.use(express.json());

import diagnosesService from './services/diagnosesService';
import patientsService from './services/patientService';

import { v4 as uuidv4 } from 'uuid';

const cors = require('cors');
app.use(cors());

const PORT = 3001;
app.get('/', (_req, res) => {
  res.send('Patientor backend');
});

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  res.json(diagnosesService.getDiagnoses());
});

app.get('/api/patients', (_req, res) => {
  res.json(patientsService.getPatients());
});

app.post('/api/patients', (req, res) => {
  try {
    const newPatient = {
      id: uuidv4(),
      ...req.body,
    };
    const addedPatient = patientsService.addPatient(newPatient);
    res.status(201).json(addedPatient);
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
