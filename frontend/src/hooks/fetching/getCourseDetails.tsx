import { apiClient } from "../clientApi";
import { AxiosResponse } from "axios";

export interface CourseDetailsInt {
  programs: CourseDetailProgram[];
  course: {
    id: number;
    lessons_total: number;
    name: string;
    tests_total: number;
  };
}

export type CourseDetailProgram = {
  id: number;
  locked: true;
  name: string;
  order: number;
  preview: string;
  state: number;
  time: number;
  type: number;
};

export const getClientCourseDetails = async (id: string | number) => {
  const { data } = await apiClient.get<CourseDetailsInt, AxiosResponse<CourseDetailsInt>>(
    `/course/course-details?id=${id}`
  );

  return data as CourseDetailsInt;
};
