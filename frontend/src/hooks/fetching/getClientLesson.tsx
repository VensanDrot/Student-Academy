import { apiClient } from "../clientApi";
import { AxiosResponse } from "axios";

export interface ClientLessonFull {
  name: string;
  description: string;
  lesson_files: {
    id: number;
    file_type: string;
    file_path: string;
  }[];
  next_id: number;
  next_name: string;
  next_type: number;
  prev_id: number;
  prev_name: string;
  prev_type: number;
}

export const getClientLessonDetails = async (id: number | string, sub_id: number | string) => {
  const { data } = await apiClient.get<ClientLessonFull, AxiosResponse<ClientLessonFull>>(`/programs/lesson?id=${id}`);

  return data as ClientLessonFull;
};
