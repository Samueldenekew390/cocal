export type ApplicantStatus = 'pending' | 'approved' | 'rejected';

export interface Applicant {
  id: string;
  fullName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';
  nationality: string;
  birthDate: string;
  age: number;
  passportNumber: string;
  photoUrl: string;
  status: ApplicantStatus;
  submittedAt: string;
  notes?: string;
  otp: string;
  phone?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  snippet: string;
  readTime: string;
  imageUrl: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
