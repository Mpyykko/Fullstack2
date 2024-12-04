import patients from '../../data/patients';
import { Patient, NewPatient } from './types';
import { v4 as uuidv4 } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    ...patient,
    id: uuidv4() 
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  addPatient
};