export interface AdminExpanded {
  message: string;
  user: {
    email: string;
    id: number;
    firstname: string;
    lastname: string;
    created_at: string;
    updated_at: string;
  };
  access: string;
  refresh?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  active: boolean;
  removeFiles: number[] | string[];
}

export type LoadingBar = {
  totalFiles: number;
  current: number;
  totalSize: number;
  uploadedSize: number;
  percentage: number;
  active: boolean;
};

export interface Categories {
  id: number;
  no: number;
  name: string;
}

export interface ProgramBuild {
  id: number | string;
  type: number;
  name: string;
  order: number;
  description: string;
  files: any[];
  rewardScore: string;
  passingScore: string;
  removeQuestion: number[];
  removeAnswer: number[];
  removeCriteria: number[];
  removeFiles: number[];
  questions: ProgramQuestion[];
  errors: ProgramBuildErrors;
}

export type ProgramBuildErrors = {
  name: string;
  description: string;
  files: string;
  rewardScore: string;
  passingScore: string;
  questions: ProgramQuestion[];
};

export interface DefaultFile {
  id: number;
  file_type: string;
  file_path: string;
}

export type ProgramAnswer = { id?: number | string; answer: string; isTrue: boolean };
export type ProgramQuestion = { id?: number | string; question: string; answers: ProgramAnswer[] };
