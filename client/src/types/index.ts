/** Defines shared client data types. */
export type College = {
  id: string;
  name: string;
  city: string;
  image?: string;
  website?: string;
  ranking?: string;
  description?: string;
  courses?: string[];
  facilities?: string[];
};

export type GovernmentExam = {
  id: string;
  name: string;
  slug: string;
  category: string;
  whoShouldTake: string;
  eligibility: string;
  syllabus: unknown;
  difficulty: string;
  opportunities: string;
  officialUrl: string;
  tags: string[];
};

