import { apiClient } from "../clientApi";
import { AxiosResponse } from "axios";
import { CourseRes } from "../mutations/createCourse";

export type CoursesAdminResponse = {
  pages: number;
  items_per_page: number;
  data: {
    id: number;
    no: number;
    name: string;
    category: string;
    status: boolean;
    users: number;
    preview: string;
  }[];
  error?: string;
};

export const getCreatedCourses = async (page: number | string, recordsPerPage: number, search: string) => {
  const { data } = await apiClient.get<CoursesAdminResponse, AxiosResponse<CoursesAdminResponse>>(
    `/course/get-courses?page=${page}&search=${search}&items_per_page=${recordsPerPage}`
  );

  return data as CoursesAdminResponse;
};

export const getCourseDetails = async (id: string | number) => {
  const { data } = await apiClient.get<CourseRes, AxiosResponse<CourseRes>>(`/course/course?id=${id}`);

  return data as CourseRes;
};
