import React, { useState } from 'react';
import axios from 'axios';
import diaryService, { NewDiaryEntry } from '../services/diaryservice';

export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}

interface Props {
  onDiaryAdded: () => void;
}

const NewDiaryForm: React.FC<Props> = ({ onDiaryAdded }) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather | string>('');
  const [visibility, setVisibility] = useState<Visibility | string>('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newEntry: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment,
    };

    const validationErrors: { [key: string]: string } = {};
    if (!date) {
      validationErrors.date = 'Date is required';
    }
    if (!weather) {
      validationErrors.weather = 'Weather is required';
    }
    if (!visibility) {
      validationErrors.visibility = 'Visibility is required';
    }
    if (!comment) {
      validationErrors.comment = 'Comment cannot be empty';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await diaryService.create(newEntry);
      onDiaryAdded();
      setDate('');
      setWeather('');
      setVisibility('');
      setComment('');
      setErrors({});
      setBackendError(null);
      setIsFormVisible(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error.response?.data as {
          message: string;
          errors: Record<string, string[]>;
        };
        if (axiosError && axiosError.errors) {
          setBackendError(axiosError.message);
          const formattedErrors: { [key: string]: string } = {};
          for (const key in axiosError.errors) {
            if (axiosError.errors.hasOwnProperty(key)) {
              formattedErrors[key] = axiosError.errors[key].join(', ');
            }
          }
          setErrors(formattedErrors);
        } else {
          setBackendError('An error occurred while adding the diary entry.');
        }
      } else {
        setBackendError('An unexpected error occurred.');
      }
      console.error(error);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  return (
    <div className="container">
      <button className="btn btn-success mb-3" onClick={toggleFormVisibility}>
        {isFormVisible ? 'Cancel' : 'Add Entry'}
      </button>

      {isFormVisible && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Date: </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                />
                {errors.date && (
                  <div className="invalid-feedback">{errors.date}</div>
                )}
              </div>
              <div className="mb-3">
                <label>Weather: </label>
                <select
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className={`form-control ${errors.weather ? 'is-invalid' : ''}`}
                >
                  <option value="">Select weather</option>
                  <option value={Weather.Sunny}>{Weather.Sunny}</option>
                  <option value={Weather.Rainy}>{Weather.Rainy}</option>
                  <option value={Weather.Cloudy}>{Weather.Cloudy}</option>
                  <option value={Weather.Stormy}>{Weather.Stormy}</option>
                  <option value={Weather.Windy}>{Weather.Windy}</option>
                </select>
                {errors.weather && (
                  <div className="invalid-feedback">{errors.weather}</div>
                )}
              </div>
              <div className="mb-3">
                <label>Visibility: </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className={`form-control ${errors.visibility ? 'is-invalid' : ''}`}
                >
                  <option value="">Select visibility</option>
                  <option value={Visibility.Great}>{Visibility.Great}</option>
                  <option value={Visibility.Good}>{Visibility.Good}</option>
                  <option value={Visibility.Ok}>{Visibility.Ok}</option>
                  <option value={Visibility.Poor}>{Visibility.Poor}</option>
                </select>
                {errors.visibility && (
                  <div className="invalid-feedback">{errors.visibility}</div>
                )}
              </div>
              <div className="mb-3">
                <label>Comment: </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                />
                {errors.comment && (
                  <div className="invalid-feedback">{errors.comment}</div>
                )}
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Add Entry
              </button>

              {backendError && (
                <div className="alert alert-danger mt-3" role="alert">
                  {backendError}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDiaryForm;
