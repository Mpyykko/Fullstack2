import express from 'express';
import { calculateBmi } from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(weight) || isNaN(height)) {
    res.send({ error: 'malformatted parameters' }).status(400);
  }

  const bmi = calculateBmi(height, weight);

  const bmiData = {
    weight,
    height,
    bmi,
  };
  res.send(bmiData).status(200);
});

app.post('/exercises', (req, res) => {
  const body = req.body;
  const dailyExercises: number[] = body.daily_exercises;
  const target: number = body.target;

  if (!target || !dailyExercises) {
    res.status(400).send({ error: 'parameters missing' });
  }

  if (isNaN(target) || dailyExercises.some(isNaN)) {
    res.status(400).send({ error: 'malformatted parameters' });
  }
  try {
    const result = calculateExercises(dailyExercises, target);
    res.send({ result }).status(200);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    }
    res.status(400).send({ error: 'Something weird is happening' });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
