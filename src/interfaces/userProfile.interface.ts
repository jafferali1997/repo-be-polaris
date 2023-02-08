import { GENDER } from '@/constants/gender-type';

export interface IUserProfile {
  name: string;

  phone: string;

  gender: GENDER;

  dateOfBirth: Date;

  cnic: string;

  educationLevel: string;

  profession: string;

  monthlyIncome: number;

  religiousPractices: string;

  city: string;

  country: string;

  ethnicity: string;

  sect: string;
}
