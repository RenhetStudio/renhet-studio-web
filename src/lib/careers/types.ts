export type CareerPosition = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};

export type CareerApplication = {
  positionId: string;
  positionTitle: string;
  name: string;
  email: string;
  location: string;
  portfolioUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  message: string;
};
