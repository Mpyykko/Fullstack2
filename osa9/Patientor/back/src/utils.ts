import { NewPatient, Gender } from './services/types';
import { z } from 'zod';

export const GenderSchema = z.enum(['male', 'female', 'other']);

export const PatientSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' }),
  dateOfBirth: z.string().refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    },
    { message: 'Invalid date format' }
  ),
  ssn: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, {
      message: 'SSN must be in format XXX-XX-XXXX',
    }),
  gender: GenderSchema,
  occupation: z
    .string()
    .min(2, { message: 'Occupation must be at least 2 characters long' }),
});

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: unknown): param is Gender => {
  return Object.values(Gender).includes(param as Gender);
};

const parseString = (value: unknown, fieldName: string): string => {
  if (!value || !isString(value)) {
    throw new Error(`Incorrect or missing ${fieldName}`);
  }
  return value;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  const patient = object as {
    name: unknown;
    dateOfBirth: unknown;
    ssn: unknown;
    gender: unknown;
    occupation: unknown;
  };

  const newPatient: NewPatient = {
    name: parseString(patient.name, 'name'),
    dateOfBirth: parseDate(patient.dateOfBirth),
    ssn: parseString(patient.ssn, 'ssn'),
    gender: parseGender(patient.gender),
    occupation: parseString(patient.occupation, 'occupation'),
  };

  return newPatient;
};
