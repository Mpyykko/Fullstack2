import React, { useEffect, useState } from 'react';
import diaryService, { DiaryEntry } from './services/diaryservice';
import Header from '../src/components/Header';
import Content from '../src/components/Content';
import NewDiaryForm from '../src/components/NewDiaryForm';

const App: React.FC = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  const fetchDiaries = async () => {
    const entries = await diaryService.getAll();
    setDiaryEntries(entries);
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  return (
    <div>
      <Header title="Diary Entries" className="text-center" />
      <NewDiaryForm onDiaryAdded={fetchDiaries} />
      <Content entries={diaryEntries} />
    </div>
  );
};

export default App;
