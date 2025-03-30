import { AxiosResponse } from "axios";
import { apiClient } from "../clientApi";
import { Categories } from "../../constants/types";

type NumberedCat = {
  total_count: number;
  jobs: Categories[];
};

export const getNumberedCategories = async () => {
  const { data } = await apiClient.get<NumberedCat, AxiosResponse<NumberedCat>>(`/categories/active-categories`);

  return data as NumberedCat;
};

export const getPurchasedCategories = async () => {
  const { data } = await apiClient.get<NumberedCat, AxiosResponse<NumberedCat>>(`/categories/purchased-categories`);

  return data as NumberedCat;
};
