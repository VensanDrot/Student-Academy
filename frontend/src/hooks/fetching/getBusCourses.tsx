import { apiClient } from "../clientApi";
import { AxiosResponse } from "axios";
import { CurrentCourse, DefaultFile, Program } from "../../constants/types";

export const getBusCourse = async (id: string | number) => {
  const { data } = await apiClient.get<CurrentCourse, AxiosResponse<CurrentCourse>>(`/course/preview-course?id=${id}`);

  return data as CurrentCourse;
};
