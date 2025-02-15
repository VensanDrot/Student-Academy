import { DefaultError, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "../clientApi";
import { AdminExpanded } from "../../constants/types";

interface useRegisterBusMutationReq {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
}

export const useSignUpMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: useRegisterBusMutationReq, context: any) => void;
  onError?: (data: any, variables: useRegisterBusMutationReq, context: any) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const { data } = await apiClient.post<AdminExpanded, AxiosResponse<AdminExpanded>, useRegisterBusMutationReq>(
        `/user/register`,
        form
      );

      return data;
    },
    onSuccess,
    onError,
  });
