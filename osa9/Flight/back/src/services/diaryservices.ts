import diaries from '../../data/entries';
import { NonSensitiveDiaryEntry, DiaryEntry } from './types';

const getEntries = (): DiaryEntry[] => {
  return diaries;
}

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};

const addDiary = (entry: DiaryEntry) => {
  diaries.push(entry);
  return entry;
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary,
};