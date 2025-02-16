import { apiClient } from "../clientApi";
import { AxiosResponse } from "axios";

export interface ClientTestFull {
  id: string | number;
  questions: {
    id: number;
    question: string;
    answers: {
      id: number;
      answer: string;
    }[];
  }[];
  max_score?: number;
  passing_score?: number;
  user_score?: number;
}

export const getClientTestDetails = async (id: number | string) => {
  const { data } = await apiClient.get<ClientTestFull, AxiosResponse<ClientTestFull>>(`/programs/test?test_id=${id}`);

  return data as ClientTestFull;
};
