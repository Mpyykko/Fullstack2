import React from 'react';
import { DiaryEntry } from '../services/diaryservice';

interface ContentProps {
  entries: DiaryEntry[];
}

const Content: React.FC<ContentProps> = ({ entries }) => {
  return (
    <div className="container mt-4">
      <div className="row">
        {entries.map((entry) => (
          <div key={entry.id} className="col-md-4">
            <div className="card mb-3">
              <div className="card-header">
                <strong>{entry.date}</strong>
              </div>
              <div className="card-body">
                <p className="card-text">
                  <strong>Weather:</strong> {entry.weather}
                </p>
                <p className="card-text">
                  <strong>Visibility:</strong> {entry.visibility}
                </p>
                <p className="card-text">
                  <strong>Comment:</strong> <em>{entry.comment}</em>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
