import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { apiClientFormData } from "../clientApi";
import { DefaultFile, ProgramQuestion } from "../../constants/types";

interface NewCategoryReq {
  name: string;
  files?: any;
  activated: boolean;
  category: string;
  description: string;
  cost: string;
}

export interface CourseRes {
  data: {
    id: number;
    name: string;
    activated: boolean;
    category: string;
    category_id: number;
    description: string;
    cost: string | number;
    course_files: DefaultFile[];
    programs: Program[];
  };
}

export interface Program {
  id: number;
  name: string;
  order: number;
  type: number;
  time: string | number;
  reward_score: number;
  passing_score: number;
  questions: ProgramQuestion[];
  lesson: {
    id: number;
    description: string;
    lesson_files: DefaultFile[];
  };
}

export const useCreateCourseMutation = ({
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
  useMutation<any, { form: NewCategoryReq; signal: AbortSignal }, any>({
    mutationFn: async ({ form, signal }) => {
      const formData = new FormData();

      // Append non-file fields
      formData.append("name", form.name);
      formData.append("activated", String(form.activated));
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("cost", form.cost);

      // Append files individually
      form?.files?.forEach((file: File, index: number) => {
        formData.append("files", file); // Use a key like "files[]" for arrays
      });

      const totalFiles = form?.files?.length;
      const totalSizeMB = form?.files?.reduce((acc: number, file: File) => acc + file?.size, 0) / (1024 * 1024);

      const { data } = await apiClientFormData.post<any, AxiosResponse<any>, NewCategoryReq>(
        `/course/course`,
        formData as any,
        {
          signal,
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
