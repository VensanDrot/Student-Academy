import { DefaultError, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "../clientApi";

interface useCreateCardMutationReq {
  pan: string;
  exp: string;
  type: string;
  holder_name: string;
  cvv: string;
  phone_number: string;
  return_url: string;
}

interface CreateRepl {
  uuid: string;
  status: string;
  octo_pay_url: string;
}

export const useCreateCardMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: useCreateCardMutationReq, context: any) => void;
  onError?: (data: any, variables: useCreateCardMutationReq, context: any) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const { data } = await apiClient.post<CreateRepl, AxiosResponse<CreateRepl>, useCreateCardMutationReq>(
        `/payments/bind-card`,
        form
      );

      return data;
    },
    onSuccess,
    onError,
  });
