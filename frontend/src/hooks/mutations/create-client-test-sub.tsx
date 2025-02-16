import { DefaultError, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient } from "../clientApi";

interface TestSubClient {
  id: number | string;
  questions: {
    id: number;
    answers: number[];
  }[];
}

interface TestResClient {
  max_score: number;
  passing_score: number;
  retries_left: number;
  user_score: number;
}

export const useCreateTestSubmissionMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: TestSubClient, context: any) => void;
  onError?: (data: any, variables: TestSubClient, context: any) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const { data } = await apiClient.post<TestResClient, AxiosResponse<TestResClient>, TestSubClient>(
        `/programs/check-answers?prog_id=${form?.prog_id}`,
        form
      );

      return data as TestResClient;
    },
    onSuccess,
    onError,
  });
