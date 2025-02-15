import { AxiosResponse } from "axios";
import { apiClient } from "../clientApi";
import { Categories } from "../../constants/types";

export type CategoriesAdminResponse = {
  pages: number;
  items_per_page: number;
  data: Categories[];
};

export const getCategoriesForCreation = async () => {
  const { data } = await apiClient.get<CategoriesAdminResponse, AxiosResponse<CategoriesAdminResponse>>(
    `/user/categories`
  );

  return data as CategoriesAdminResponse;
};
