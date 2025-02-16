import { DefaultError, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClient, apiClientFormData } from "../clientApi";

export interface ProgramLesson {
  name: string;
  type: number;
  files: any[];
  description: string;
  order: number | string;
  course_id: number | string;
}

export const useCreateLessonMutation = ({
  onSuccess,
  onError,
  onProgress,
}: {
  onSuccess?: (data: any, variables: ProgramLesson, context: any) => void;
  onError?: (data: any, variables: ProgramLesson, context: any) => void;
  onProgress?: (details: {
    current: number;
    uploadedSize: number;
    totalSize: number;
    percentage: number;
    totalFiles: number;
  }) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const formData = new FormData();

      // Append non-file fields
      formData.append("name", form?.name);
      formData.append("order", form?.order);
      formData.append("description", form?.description);

      // Append files individually
      form?.files?.forEach((file: File, index: number) => {
        formData.append("lesson", file); // Use a key like "files[]" for arrays
      });

      const totalFiles = form?.files?.length;
      const totalSizeMB = form?.files?.reduce((acc: number, file: File) => acc + file?.size, 0) / (1024 * 1024);

      const { data } = await apiClientFormData.post<any, AxiosResponse<any>, ProgramLesson>(
        `/programs/add-program?type=${form?.type}&course_id=${form?.course_id}`,
        formData as any,
        {
          onUploadProgress:
            form?.files && form?.files.length > 0
              ? (progressEvent) => {
                  if (progressEvent?.total) {
                    const uploadedSize = +(progressEvent.loaded / (1024 * 1024)).toFixed(2); // Uploaded in MB rounded to 2 decimals
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    const totalSize = +totalSizeMB.toFixed(2); // Round total size to 2 decimals

                    if (onProgress) {
                      const current = Math.floor((progressEvent.loaded / progressEvent.total) * form.files.length);

                      onProgress({
                        current,
                        uploadedSize,
                        totalSize,
                        percentage,
                        totalFiles,
                      });
                    }
                  }
                }
              : undefined,
        }
      );

      return data;
    },
    onSuccess,
    onError,
  });

export const useCreateTestMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (data: any, variables: any, context: any) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const { data } = await apiClient.post<any, AxiosResponse<any>, any>(
        `/programs/add-program?type=${form?.type}&course_id=${form?.course_id}`,
        {
          name: form?.name,
          order: form?.order,
          passing_score: form?.passing_score,
          reward_score: form?.reward_score,
          questions: [...form?.questions],
        }
      );

      return data;
    },
    onSuccess,
    onError,
  });

export const useCreateExamMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (data: any, variables: any, context: any) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const { data } = await apiClient.post<any, AxiosResponse<any>, any>(
        `/admin/add-program?type=${form?.type}&course_id=${form?.course_id}`,
        {
          name: form?.name,
          order: form?.order,
          criteria: [...form?.criteria],
        }
      );

      return data;
    },
    onSuccess,
    onError,
  });
