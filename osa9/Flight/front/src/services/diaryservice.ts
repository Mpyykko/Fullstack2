import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/diaries';

export interface DiaryEntry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

export interface NewDiaryEntry {
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

const getAll = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

const create = async (newEntry: NewDiaryEntry) => {
  const response = await axios.post<DiaryEntry>(baseUrl, newEntry);
  return response.data;
};

export default { getAll, create };
