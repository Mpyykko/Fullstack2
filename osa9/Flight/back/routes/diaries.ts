import express from 'express';
import diaryService from '../src/services/diaryservices';


const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diaryService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
  const newDiary = req.body;
  const addedDiary = diaryService.addDiary(newDiary);
  res.json(addedDiary);
});

export default router;