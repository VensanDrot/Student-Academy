import { DefaultError, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "../clientApi";

interface deleteCategoryInterface {
  id: number | string;
}

export const useDeleteProgramMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: deleteCategoryInterface, context: any) => void;
  onError?: (data: any, variables: deleteCategoryInterface, context: any) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const { data } = await apiClient.delete<any, AxiosResponse<any>, deleteCategoryInterface>(`/programs/${form.id}`);

      return data;
    },
    onSuccess,
    onError,
  });
