import diagnoses from '../../data/diagnoses';
import { Diagnosis } from '../../src/services/types';

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

export default {
  getDiagnoses
};