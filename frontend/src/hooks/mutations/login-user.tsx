import { DefaultError, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "../clientApi";
import { AdminExpanded } from "../../constants/types";
import Cookies from "js-cookie";

interface useLogBusMutationReq {
  email: string;
  password: string;
  remember_me: string;
}

export const useLoginMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: useLogBusMutationReq, context: any) => void;
  onError?: (data: any, variables: useLogBusMutationReq, context: any) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const { data } = await apiClient.post<AdminExpanded, AxiosResponse<AdminExpanded>, useLogBusMutationReq>(
        `/user/login`,
        form
      );

      return data;
    },
    onSuccess,
    onError,
  });

export const useRefreshToken = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const refreshToken = Cookies.get("refresh");
      const { data } = await apiClient.get<any, AxiosResponse<any>, any>("/user/refresh", {
        headers: {
          "Content-Type": "application/json",
          refresh: refreshToken, // Add any custom header here
        },
      });

      Cookies.set("access", data?.access as string, { expires: 1 / 3 });
      Cookies.set("refresh", data?.refresh as string, { expires: 7 });
      Cookies.set("name", data?.user?.firstname as string, { expires: 7 });
      data?.user?.lastname && Cookies.set("lastname", data?.user?.lastname as string, { expires: 7 });
      data?.user?.email && Cookies.set("email", data?.user?.email as string, { expires: 7 });

      return data as any;
    },
    onSuccess,
    onError,
  });
