import { AxiosResponse } from "axios";
import { apiClient } from "../clientApi";
import { Categories } from "../../constants/types";

type NumberedCat = {
  total_count: number;
  jobs: Categories[];
};

export const getNumberedCategories = async () => {
  const { data } = await apiClient.get<NumberedCat, AxiosResponse<NumberedCat>>(`/user/active-categories`);

  return data as NumberedCat;
};
