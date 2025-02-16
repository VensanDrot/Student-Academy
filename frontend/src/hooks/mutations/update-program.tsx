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

export const useUpdateLessonMutation = ({
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
      form?.name && formData.append("name", form?.name);
      form?.description && formData.append("description", form?.description);

      // Append files individually
      form?.files &&
        form?.files?.forEach((file: File) => {
          formData.append("files", file); // Use a key like "files[]" for arrays
        });

      // Append files id to remove
      form?.remove_files &&
        form?.remove_files?.forEach((id: number | string) => {
          formData.append("remove_files", String(id));
        });

      const totalFiles = form?.files?.length;
      const totalSizeMB = form?.files?.reduce((acc: number, file: File) => acc + file?.size, 0) / (1024 * 1024);

      const { data } = await apiClientFormData.patch<any, AxiosResponse<any>, ProgramLesson>(
        `/programs/edit-program?type=${form?.type}&program_id=${form?.program_id}`,
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

export const useUpdateTestMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (data: any, variables: any, context: any) => void;
}) =>
  useMutation<any, DefaultError, any>({
    mutationFn: async (form) => {
      const { data } = await apiClient.patch<any, AxiosResponse<any>, any>(
        `/programs/edit-program?type=${form?.type}&program_id=${form?.id}`,
        form
      );

      return data;
    },
    onSuccess,
    onError,
  });
