import { z } from 'zod';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GenderSchema = z.enum(['male', 'female', 'other']);

export const PatientSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  dateOfBirth: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, { message: 'Invalid date format' }),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, { message: 'SSN must be in format XXX-XX-XXXX' }),
  gender: GenderSchema,
  occupation: z.string().min(2, { message: 'Occupation must be at least 2 characters long' }),
});

export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
  }
  


  export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other'
  }

  export const isGender = (param: unknown): param is Gender => {
    return Object.values(Gender).includes(param as Gender);
  };
  

  export const parseGender = (gender: unknown): Gender => {
    if (!gender || !isGender(gender)) {
      throw new Error('Incorrect or missing gender');
    }
    return gender;
  };
  
 
  export type NewPatient = Omit<Patient, 'id'>;
  export type Patient = z.infer<typeof PatientSchema> & { id?: string };
