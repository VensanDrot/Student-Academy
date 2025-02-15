import { CourseOrgActive } from "../../constants/types";
import { apiClient } from "../clientApi";
import { AxiosResponse } from "axios";

export type CoursesAdminResponse = {
  pages: number;
  courses: CourseOrgActive[];
  error?: string;
};

export const getAllCourses = async (
  page: number | string,
  recordsPerPage: number,
  search: string,
  category?: string
) => {
  const cat = category ? `&cat_id=${category}` : "";
  const { data } = await apiClient.get<CoursesAdminResponse, AxiosResponse<CoursesAdminResponse>>(
    `/course/courses?page=${page}&search=${search}&items_per_page=${recordsPerPage}${cat}`
  );

  return data as CoursesAdminResponse;
};
