import { DefaultError, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClientFormData } from "../clientApi";
import { CourseRes } from "./create-course";

interface NewCategoryReq {
  id: number; // Ensure `id` is present
  name?: string;
  files?: any;
  activated?: boolean;
  category?: string;
  description?: string;
  cost?: string;
  remove_files?: number[] | string[];
  signal?: AbortSignal; // Add AbortSignal for cancellation
}

export const useUpdateCourseMutation = ({
  onSuccess,
  onError,
  onProgress,
}: {
  onSuccess?: (data: any, variables: { form: NewCategoryReq; signal: AbortSignal }, context: any) => void;
  onError?: (data: any, variables: { form: NewCategoryReq; signal: AbortSignal }, context: any) => void;
  onProgress?: (details: {
    current: number;
    uploadedSize: number;
    totalSize: number;
    percentage: number;
    totalFiles: number;
  }) => void;
}) =>
  useMutation<any, DefaultError, { form: NewCategoryReq; signal: AbortSignal }>({
    mutationFn: async ({ form, signal }) => {
      const formData = new FormData();

      form?.name && formData.append("name", form.name);
      form?.activated?.toString() && formData.append("activated", String(form?.activated));
      form?.category && formData.append("category", form.category);
      form?.description && formData.append("description", form.description);
      form?.cost && formData.append("cost", form.cost);

      form?.files &&
        form?.files?.forEach((file: File) => {
          formData.append("files", file);
        });

      form?.remove_files && form?.remove_files?.forEach((id: any) => formData.append("remove_files", id));

      const totalFiles = form?.files?.length;
      const totalSizeMB = form?.files?.reduce((acc: number, file: File) => acc + file.size, 0) / (1024 * 1024);

      const { data } = await apiClientFormData.patch<CourseRes, AxiosResponse<CourseRes>, NewCategoryReq>(
        `/course/${form.id}`,
        formData as any,
        {
          signal, // Pass the signal for cancellation
          onUploadProgress:
            form?.files && form?.files.length > 0
              ? (progressEvent) => {
                  if (progressEvent?.total) {
                    const uploadedSize = +(progressEvent.loaded / (1024 * 1024)).toFixed(2); // Uploaded in MB
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    const totalSize = +totalSizeMB.toFixed(2); // Total size in MB

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
