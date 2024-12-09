import React from 'react';
import { DiaryEntry } from '../services/diaryservice';

interface DiaryProps {
  entry: DiaryEntry;
}

const Diary: React.FC<DiaryProps> = ({ entry }) => {
  return (
    <div>
      <h3>{entry.date}</h3>
      <p>
        <strong>Weather:</strong> {entry.weather}
      </p>
      <p>
        <strong>Visibility:</strong> {entry.visibility}
      </p>
      <p>
        <strong>Comment:</strong> {entry.comment}
      </p>
    </div>
  );
};

export default Diary;
