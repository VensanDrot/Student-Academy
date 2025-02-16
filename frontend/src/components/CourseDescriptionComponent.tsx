import React, { SetStateAction, useState } from "react";
import { FileUpload, UploadedFile } from "./FileUpload";
import { Button, Select, Switch, TextArea, TextInput } from "@gravity-ui/uikit";
import { useTranslation } from "react-i18next";
import ProgressBar from "./ProgressBar";
// import { CourseRes, useCreateCourseMutation } from "../hooks/mutations/create-course-admin";
// import { useUpdateCourseMutation } from "../hooks/mutations/update-course-admin";
import { isEmpty } from "lodash";
import { Course, LoadingBar } from "../constants/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ToasterReq } from "../pages/CourseCreation";
import { useCreateCourseMutation, CourseRes } from "../hooks/mutations/create-course";
import { useUpdateCourseMutation } from "../hooks/mutations/update-course";

interface IProps {
  courseRetrieve: any; // change type
  files: UploadedFile[];
  course: Course;
  setCourseAndFiles: (data: any) => void; // change type
  setCourse: React.Dispatch<SetStateAction<Course>>;
  setLoadingBar: React.Dispatch<SetStateAction<LoadingBar>>;
  setFiles: React.Dispatch<SetStateAction<UploadedFile[]>>;
  setDeleteCourse: React.Dispatch<SetStateAction<boolean>>;
  setToaster: React.Dispatch<SetStateAction<ToasterReq>>;
  categories: any;
  loadingBar: LoadingBar;
}

const CourseDescriptionComponent: React.FC<IProps> = ({
  courseRetrieve,
  setCourseAndFiles,
  setLoadingBar,
  setFiles,
  setCourse,
  setDeleteCourse,
  setToaster,
  course,
  categories,
  files,
  loadingBar,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [isDisabled, setIsDisabled] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    files: "",
  });

  const createCourseMutation = useCreateCourseMutation({
    onSuccess: (data) => {
      setCourseAndFiles(data);
      setToaster({ header: t("prog_up"), line: "", open: true, error: false });
      setIsDisabled(false);
      setLoadingBar((prev) => ({ ...prev, active: false }));
      navigate(`/createcourse?id=${data?.data?.id}`);
      queryClient.setQueryData(["courseRetrieve", searchParams?.get("id")], (old: CourseRes) => {
        const updated = old
          ? {
              ...old,
              data: {
                ...old?.data,
                ...data?.data,
              },
            }
          : old;

        setCourseAndFiles(updated);
        return updated;
      });
    },
    onError: (data) => {
      console.log(data);
      setIsDisabled(false);
      setToaster({
        header: t("err_head"),
        line: data?.response?.data?.message || t("def_err"),
        open: true,
        error: true,
      });
      setLoadingBar((prev) => ({ ...prev, active: false }));
    },
    onProgress: (data) => {
      !loadingBar?.active && setLoadingBar((prev) => ({ ...prev, ...data, active: true }));
      setLoadingBar((prev) => ({ ...prev, ...data }));
    },
  });

  const updateCourseMutation = useUpdateCourseMutation({
    onSuccess: (data) => {
      setToaster({ header: t("prog_up"), line: "", open: true, error: false });
      setIsDisabled(false);
      setCourseAndFiles(data);
      setLoadingBar((prev) => ({ ...prev, active: false }));
      queryClient.setQueryData(["courseRetrieve", searchParams?.get("id")], (old: CourseRes) => {
        const updated = old
          ? {
              ...old,
              data: {
                ...old?.data,
                ...data?.data,
              },
            }
          : old;

        setCourseAndFiles(updated);
        return updated;
      });
    },
    onError: (data) => {
      console.log(data);
      setIsDisabled(false);
      setToaster({
        header: t("err_head"),
        line: data?.response?.data?.message || t("def_err"),
        open: true,
        error: true,
      });
      if (data?.message !== "canceled") {
        setLoadingBar((prev) => ({ ...prev, active: false }));
        setCourseAndFiles(courseRetrieve);
      }
    },
    onProgress: (data) => {
      !loadingBar?.active && setLoadingBar((prev) => ({ ...prev, ...data, active: true }));
      setLoadingBar((prev) => ({ ...prev, ...data }));
    },
  });

  const emptyErrors = () => {
    setErrors({ name: "", description: "", category: "", price: "", files: "" });
  };

  const changeError = (id: keyof typeof errors, error: string) => {
    setErrors((prev: any) => ({ ...prev, [id]: error }));
  };

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id?: string,
    value?: string | number
  ) => {
    setCourse((prev: Course) => ({ ...prev, [id || e.target.id]: value || e.target.value }));
  };

  //create course
  const handleCreateCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let err = 0;
    emptyErrors();
    const abortController = new AbortController();
    setController(abortController);

    if (course?.name?.trim().length < 2) {
      err++;
      changeError("name", t("course.name_error"));
    }

    if (course?.description?.trim().length < 2) {
      err++;
      changeError("description", t("course.description_error"));
    }

    if (course?.description?.trim().length < 2) {
      err++;
      changeError("price", t("course.price_error"));
    }

    if (!course.category) {
      err++;
      changeError("category", t("course.category_error"));
    }

    if (files.length < 1) {
      err++;
      changeError("files", t("course.files_error"));
    }

    if (err !== 0) return;

    setIsDisabled(true);

    createCourseMutation.mutate({
      form: {
        name: course.name,
        files: files,
        activated: course.active,
        category: course.category,
        description: course.description,
        cost: course.price,
      },
      signal: abortController.signal,
    });
  };

  const handleUpdateCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let err = 0;
    emptyErrors();
    let obj = {} as any;
    const abortController = new AbortController();
    setController(abortController);

    if (course?.name?.trim() !== courseRetrieve?.data?.name?.trim()) {
      obj["name"] = course?.name;
      if (course?.name?.trim().length < 2) {
        err++;
        changeError("name", t("course.name_error"));
      }
    }

    // Validate and add "description" to the update object if changed
    if (course?.description?.trim() !== courseRetrieve?.data?.description?.trim()) {
      obj["description"] = course?.description;
      if (course?.description?.trim().length < 2) {
        err++;
        changeError("description", t("course.description_error"));
      }
    }

    // Validate and add "price" to the update object if changed
    if (course?.price?.trim() !== courseRetrieve?.data?.cost?.toString()?.trim()) {
      obj["cost"] = course?.price;
      if (course?.price?.trim().length < 1 || isNaN(Number(course?.price))) {
        err++;
        changeError("price", t("course.price_error"));
      }
    }

    // Validate and add "category" to the update object if changed
    if (course?.category !== courseRetrieve?.data?.category) {
      obj["category"] = course?.category;
      if (!course?.category) {
        err++;
        changeError("category", t("course.category_error"));
      }
    }

    // Add files to delete if specified
    if (course?.removeFiles?.length !== 0) {
      obj["remove_files"] = course?.removeFiles;
    }

    if (course?.active !== courseRetrieve?.data?.activated) {
      obj["activated"] = course?.active;
    }

    if (files?.filter((file) => !file?.id).length > 0) {
      obj["files"] = files?.filter((file) => !file?.id);
    }

    if (err !== 0 || isEmpty(obj)) return;

    setIsDisabled(true);

    obj["id"] = course.id;

    updateCourseMutation.mutate({ form: obj, signal: abortController.signal as any });
  };

  const cancelFunction = () => {
    setCourseAndFiles(courseRetrieve);
    if (controller) {
      controller.abort();
      console.log("Update cancelled");
      setLoadingBar((prev) => ({ ...prev, active: false }));
      setIsDisabled(false);
    }
  };

  const handleCancel = () => {
    if (controller) {
      controller.abort();
      console.log("Update cancelled");
    }
    setLoadingBar((prev) => ({ ...prev, active: false }));
    setIsDisabled(false);
  };

  return (
    <form
      onSubmit={course?.id ? handleUpdateCourse : handleCreateCourse}
      className="flex !w-[100%] h-fit gap-8 relative"
    >
      <div className="flex flex-col gap-5 w-[100%] max-w-[850px] bg-white rounded-3xl p-6 overflow-hidden">
        {loadingBar.active && (
          <ProgressBar
            current={loadingBar?.current}
            percentage={loadingBar?.percentage}
            totalFiles={loadingBar?.totalFiles}
            totalSize={loadingBar?.totalSize}
            uploadedSize={loadingBar?.uploadedSize}
            onClick={handleCancel}
          />
        )}

        <FileUpload
          files={files}
          error={errors.files}
          textEmpty={t("course.no_pics")}
          setArray={setFiles}
          delFunction={(item) =>
            item?.id && setCourse((prev: Course) => ({ ...prev, removeFiles: [...prev.removeFiles, item?.id] }))
          }
        />

        <div className="flex flex-col gap-1">
          <p className="text-ft font-normal text-textlightgrey">{t("course.name")}</p>
          <TextInput
            id="name"
            value={course.name}
            type="text"
            size="xl"
            onChange={inputHandler}
            validationState={errors.name ? "invalid" : undefined}
            errorMessage={errors.name}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-ft font-normal text-textlightgrey">{t("course.description")}</p>
          <TextArea
            id="description"
            value={course.description}
            size="xl"
            onChange={inputHandler}
            validationState={errors.description ? "invalid" : undefined}
            errorMessage={errors.description}
            minRows={5}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-ft font-normal text-textlightgrey">{t("course.category")}</p>
          <Select
            id="category"
            onUpdate={(e) => setCourse((prev: Course) => ({ ...prev, category: e[0] }))}
            size="xl"
            value={[course.category]}
            placeholder={t("course.select")}
            validationState={errors.category ? "invalid" : undefined}
            errorMessage={errors.category}
          >
            {categories?.map((category: any) => (
              <Select.Option key={`${categories.name}+${categories.id}`} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-ft font-normal text-textlightgrey">{t("course.price")}</p>
          <TextInput
            id="price"
            value={course?.price}
            type="text"
            size="xl"
            onChange={(e) => setCourse((prev) => ({ ...prev, price: e.target.value.replace(/[^\d.]/g, "") }))}
            validationState={errors.price ? "invalid" : undefined}
            errorMessage={errors.price}
          />
        </div>

        <hr className="w-[calc(100%+48px)] -ml-6" />

        <div className="flex justify-between">
          <Button type="button" onClick={cancelFunction} size="xl">
            {t("admin_users.cancel_change")}
          </Button>

          <Button type="submit" size="xl" view="action" disabled={isDisabled}>
            {t("admin_users.save_change")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 !w-[350px] shrink-0">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl">
          <span className="text-st font-semibold">{t("course.active")}</span>
          <Switch
            checked={course?.active}
            onChange={() => setCourse((prev: Course) => ({ ...prev, active: !prev.active }))}
            size="l"
          />
        </div>

        <div className="flex justify-between items-center bg-white p-6 rounded-3xl">
          <span className="text-st font-semibold">{t("course.delete_course")}</span>
          <Button
            type="button"
            onClick={() => setDeleteCourse(true)}
            className="w-fit before:!bg-negred [&>*]:text-negredtext"
            view="action"
            size="l"
          >
            {t("course.delete")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CourseDescriptionComponent;
