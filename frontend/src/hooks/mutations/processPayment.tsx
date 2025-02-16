import { DefaultError, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "../clientApi";

interface useBusSubscribers {
  course_id: number | string;
  card_id: number | string;
}

interface useCreateSubBus {
  subscribers: number[];
  course_id: number | string;
  card_id: number | string;
}
export const useProcessPayment = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: useBusSubscribers, context: any) => void;
  onError?: (data: any, variables: useBusSubscribers, context: any) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const { data } = await apiClient.post<useCreateSubBus, AxiosResponse<useCreateSubBus>, useCreateSubBus>(
        `/payments/proccess`,
        form
      );

      return data;
    },
    onSuccess,
    onError,
  });
