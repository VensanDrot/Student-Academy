import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Select } from "@gravity-ui/uikit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { getAdminCategories } from "../hooks/fetching/getAdminCategories";
import ModalWindow from "../components/ModalWindow";
// import { useDeleteCourseMutation } from "../hooks/mutations/delete-course-admin";
import CourseDescriptionComponent from "../components/CourseDescriptionComponent";

import { ReactComponent as Bin } from "../img/bin.svg";
import { ReactComponent as Star } from "../img/star.svg";
import { ReactComponent as Save } from "../img/save.svg";
import { ReactComponent as Arrow } from "../img/toright.svg";
import Toaster from "../components/Toaster";
import { getCategoriesForCreation } from "../hooks/fetching/getCategories";
import { ProgramBuild } from "../constants/types";
import { getCourseDetails } from "../hooks/fetching/getCourses";
import { CourseRes } from "../hooks/mutations/createCourse";
import { useDeleteCourseMutation } from "../hooks/mutations/deleteCourse";

export interface ToasterReq {
  error: boolean;
  header: string;
  open: boolean;
  line: string;
}

const CourseCreation = () => {
  const page = 1;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const active = `bg-white text-textblack`;
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<number>(1);
  const [files, setFiles] = useState<any[]>([]);
  const [deleteCourse, setDeleteCourse] = useState(false);
  const [deleteProgram, setDeleteProgram] = useState(false);
  const [deleteProgramObject, setDeleteProgramObject] = useState({} as any); // types
  const [currentProgram, setCurrentProgram] = useState(-1);
  const [programs, setPrograms] = useState<any[]>([]); //types
  const [toaster, setToaster] = useState<ToasterReq>({
    error: false,
    header: "",
    open: false,
    line: "",
  });
  const [loadingBar, setLoadingBar] = useState({
    totalFiles: 0,
    current: 0,
    totalSize: 0,
    uploadedSize: 0,
    percentage: 0,
    active: false,
  });
  const [course, setCourse] = useState({
    id: searchParams.get("id") || "",
    name: searchParams.get("name") || "",
    description: "",
    category: "",
    price: "",
    active: true,
    removeFiles: [] as number[] | string[],
  });

  const { data: courseRetrieve, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["courseRetrieve", searchParams.get("id")],
    queryFn: () => getCourseDetails(searchParams?.get("id") as string),
    retry: 1,
    enabled: !!searchParams?.get("id"),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategoriesForCreation(),
    retry: 1,
  });

  useEffect(() => {
    if (courseRetrieve && !isLoadingCourse) setCourseAndFiles(courseRetrieve);
    if (programs?.length < 1) createProgram(1);
  }, [courseRetrieve, isLoadingCourse]);

  const setCourseAndFiles = (data: any) => {
    setCourse((prev) => ({
      ...prev,
      id: data?.data?.id,
      name: data?.data?.name,
      active: String(data?.data?.activated) === "true" ? data?.data?.activated : false,
      description: data?.data?.description,
      category: data?.data?.category,
      price: data?.data?.cost.toString(),
    }));

    data?.data?.course_files &&
      setFiles(
        data?.data?.course_files?.map((file: any) => ({
          path: file?.file_path,
          preview: file?.file_path,
          type: file?.file_type,
          id: file?.id,
        }))
      );

    // if (data?.data?.programs) {
    //   setPrograms(
    //     data?.data?.programs?.map(
    //       (program: any) =>
    //         ({
    //           id: program?.id,
    //           name: program?.name,
    //           description: program?.description,
    //           order: program?.order,
    //           files: program?.lesson?.map((file: any) => ({
    //             path: file?.file_path,
    //             preview: file?.file_path,
    //             type: file?.file_type,
    //             id: file?.id,
    //           })),
    //           type: program?.type,
    //           questions: program?.test?.questions?.map((question: any) => ({
    //             id: question?.id,
    //             question: question?.question,
    //             answers: question?.answers?.map((answer: any) => ({
    //               id: answer?.id,
    //               answer: answer?.answer,
    //               isTrue: answer?.is_true,
    //             })),
    //           })),
    //           criteria: program?.exam?.criteria?.map((criteria: any) => ({
    //             id: criteria?.id,
    //             name: criteria?.name,
    //             description: criteria?.description,
    //           })),
    //           passingScore: program?.test?.passing_score,
    //           rewardScore: program?.test?.reward_score,
    //           errors: {
    //             name: "",
    //             description: "",
    //             files: "",
    //             rewardScore: "",
    //             passingScore: "",
    //             questions: program?.test?.questions?.map((question: any) => ({
    //               question: "",
    //               answers: Array.from({ length: question?.answers?.length || 0 }, () => ({
    //                 answer: "",
    //                 isTrue: false,
    //               })),
    //             })),
    //             criteria: Array.from({ length: program?.criteria?.length || 0 }, () => ({ name: "", description: "" })),
    //           },
    //         } as ProgramBuild)
    //     )
    //   );
    //   currentProgram === -1 && setCurrentProgram(0);
    // }
  };

  // useEffect(() => {
  //   if (courseRetrieve && !isLoadingCourse) setCourseAndFiles(courseRetrieve);
  //   if (programs?.length < 1) createProgram(1);
  // }, [courseRetrieve, isLoadingCourse]);

  // delete Course Mutation
  const deleteCourseMutation = useDeleteCourseMutation({
    onSuccess: (_data) => {
      navigate("/uploadedcourses");
    },
    onError: (data) => {
      setToaster({ header: t("err_head"), line: data?.response?.data?.message || "", open: true, error: true });
      setCourseAndFiles(courseRetrieve);
      setDeleteCourse(false);
    },
  });

  // //delete Program Mutation
  // const deleteProgramMutation = useDeleteProgramMutation({
  //   onSuccess: (data) => {
  //     queryClient.setQueryData(["courseRetrieve", searchParams?.get("id")], (old: CourseRes) => {
  //       const updated = old
  //         ? {
  //             ...old,
  //             data: {
  //               ...old?.data,
  //               programs: old?.data?.programs?.filter(
  //                 (program: any) => program?.id !== deleteProgramObject?.id && program
  //               ),
  //             },
  //           }
  //         : old;

  //       setCourseAndFiles(updated);
  //       return updated;
  //     });
  //     setCurrentProgram(0);
  //     setPrograms(programs?.filter((program: ProgramBuild) => program?.id !== deleteProgramObject?.id && program));
  //   },
  //   onError: (data) => {
  //     console.log(data);
  //     setCourseAndFiles(courseRetrieve);
  //   },
  // });

  // //create Lesson Mutation
  // const createProgramLessonMutation = useCreateLessonMutation({
  //   onSuccess: (data) => {
  //     setPrograms((prev) =>
  //       prev?.map((program, index) => (index === currentProgram ? { ...program, id: data?.data?.id } : program))
  //     );
  //     setLoadingBar((prev) => ({ ...prev, ...data, active: false }));

  //     queryClient.setQueryData(["courseRetrieve", searchParams?.get("id")], (old: CourseRes) => {
  //       const updated = old
  //         ? {
  //             ...old,
  //             data: {
  //               ...old?.data,
  //               programs: [...(old?.data?.programs || []), data?.data],
  //             },
  //           }
  //         : old;
  //       setCourseAndFiles(updated);
  //       return updated;
  //     });
  //   },
  //   onError: (data) => {
  //     console.log(data);
  //     setLoadingBar((prev) => ({ ...prev, ...data, active: false }));
  //   },
  //   onProgress: (data) => {
  //     !loadingBar?.active && setLoadingBar((prev) => ({ ...prev, ...data, active: true }));
  //     setLoadingBar((prev) => ({ ...prev, ...data }));
  //   },
  // });

  // const updateProgramLessonMutation = useUpdateLessonMutation({
  //   onSuccess: (data) => {
  //     setPrograms((prev) =>
  //       prev?.map((program, index) => (index === currentProgram ? { ...program, id: data?.data?.id } : program))
  //     );
  //     setLoadingBar((prev) => ({ ...prev, ...data, active: false }));

  //     queryClient.setQueryData(["courseRetrieve", searchParams?.get("id")], (old: CourseRes) => {
  //       const updated = old
  //         ? {
  //             ...old,
  //             data: {
  //               ...old?.data,
  //               programs: [
  //                 ...(old?.data?.programs?.map((program: any) =>
  //                   program?.id === data?.data?.id ? data?.data : program
  //                 ) || []),
  //               ],
  //             },
  //           }
  //         : old;
  //       setCourseAndFiles(updated);
  //       return updated;
  //     });
  //   },
  //   onError: (data) => {
  //     console.log(data);
  //     setLoadingBar((prev) => ({ ...prev, ...data, active: false }));
  //   },
  //   onProgress: (data) => {
  //     !loadingBar?.active && setLoadingBar((prev) => ({ ...prev, ...data, active: true }));
  //     setLoadingBar((prev) => ({ ...prev, ...data }));
  //   },
  // });

  // //create Test Mutation
  // const createTestLessonMutation = useCreateTestMutation({
  //   onSuccess: (data) => {
  //     setPrograms((prev) =>
  //       prev?.map((program, index) => (index === currentProgram ? { ...program, id: data?.data?.id } : program))
  //     );
  //     setLoadingBar((prev) => ({ ...prev, ...data, active: false }));

  //     queryClient.setQueryData(["courseRetrieve", searchParams?.get("id")], (old: CourseRes) => {
  //       const updated = old
  //         ? {
  //             ...old,
  //             data: {
  //               ...old?.data,
  //               programs: [...(old?.data?.programs || []), data?.data],
  //             },
  //           }
  //         : old;

  //       setCourseAndFiles(updated);
  //       return updated;
  //     });
  //   },
  //   onError: (data) => {
  //     console.log(data);
  //     setLoadingBar((prev) => ({ ...prev, ...data, active: false }));
  //   },
  // });

  // // update test mutation
  // const updateTestLessonMutation = useUpdateTestMutation({
  //   onSuccess: (data) => {
  //     setPrograms((prev) =>
  //       prev?.map((program, index) => (index === currentProgram ? { ...program, id: data?.data?.id } : program))
  //     );

  //     queryClient.setQueryData(["courseRetrieve", searchParams?.get("id")], (old: CourseRes) => {
  //       const updated = old
  //         ? {
  //             ...old,
  //             data: {
  //               ...old?.data,
  //               programs: [
  //                 ...(old?.data?.programs?.map((program: any) =>
  //                   program?.id === data?.data?.id ? data?.data : program
  //                 ) || []),
  //               ],
  //             },
  //           }
  //         : old;
  //       setCourseAndFiles(updated);
  //       return updated;
  //     });
  //   },
  //   onError: (data) => {
  //     console.log(data);
  //   },
  // });

  //delete course
  const deleteFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteCourseMutation.mutate({ id: course.id });
  };

  //delete Program Handler
  const deleteProgramFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (deleteProgramObject?.id) deleteProgramMutation.mutate({ id: deleteProgramObject?.id });

    setPrograms(programs?.filter((program: ProgramBuild) => program?.order !== deleteProgramObject?.order && program));
    setDeleteProgram(false);
  };

  const selectTextToDisplay = (type: number) => {
    if (type === 1) return t("course.lesson");
    if (type === 2) return t("course.test");
    return t("course.exam");
  };

  const handleDisplayPrograms = (type: number, program: ProgramBuild, index: number) => {
    switch (type) {
      case 2:
        return (
          <div
            onClick={() => setCurrentProgram(index)}
            key={`${((program?.name, program?.order, program?.type), index)}`}
            className={`flex gap-2 w-[350px] items-center bg-white p-5 rounded-3xl border-[2px] border-transparent ${
              index === currentProgram && "!border-lightorange"
            }`}
          >
            <div className="bg-[#30AA6E] rounded-full h-10 w-10 flex items-center justify-center">
              <Save className="fill-white h-3.5 w-3.5" />
            </div>

            <div className="flex flex-col gap-1 w-[calc(100%-100px)] overflow-hidden">
              <p className="text-tr whitespace-nowrap font-normal flex gap-1 text-icongray overflow-hidden text-ellipsis">
                {selectTextToDisplay(program?.type)}
                <span>№{program?.order}</span>
              </p>
              <p className="text-ft whitespace-nowrap font-semibold overflow-hidden text-ellipsis">
                {program?.name || t("no_name")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDeleteProgram(true);
                setDeleteProgramObject(program);
              }}
              className="ml-auto mr-0 w-10 h-10 flex justify-center items-center"
            >
              <Bin className="fill-icongray" />
            </button>
          </div>
        );
      case 3:
        return (
          <div
            onClick={() => setCurrentProgram(index)}
            key={`${((program?.name, program?.order, program?.type), index)}`}
            className={`flex gap-2 w-[350px] items-center bg-white p-5 rounded-3xl border-[2px] border-transparent ${
              index === currentProgram && "!border-lightorange"
            }`}
          >
            <div className="bg-lightorange rounded-full h-10 w-10 flex items-center justify-center">
              <Star className="fill-textblack h-3.5 w-3.5" />
            </div>

            <div className="flex flex-col gap-1 w-[calc(100%-100px)] overflow-hidden">
              <p className="text-tr whitespace-nowrap font-normal flex gap-1 text-icongray overflow-hidden text-ellipsis">
                {selectTextToDisplay(program?.type)}
                <span>№{program?.order}</span>
              </p>
              <p className="text-ft whitespace-nowrap font-semibold overflow-hidden text-ellipsis">
                {program?.name || t("no_name")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDeleteProgram(true);
                setDeleteProgramObject(program);
              }}
              className="ml-auto mr-0 w-10 h-10 flex justify-center items-center"
            >
              <Bin className="fill-icongray" />
            </button>
          </div>
        );
      default:
        return (
          <div
            onClick={() => setCurrentProgram(index)}
            key={`${((program?.name, program?.order, program?.type), index)}`}
            className={`flex gap-2 w-[350px] items-center bg-white p-5 rounded-3xl border-[2px] border-transparent ${
              index === currentProgram && "!border-lightorange"
            }`}
          >
            <div
              className={`p-5 bg-primarylight rounded-full w-10 h-10 text-tr font-semibold flex items-center justify-center`}
            >
              {program?.order}
            </div>
            <div className="flex flex-col gap-1 w-[calc(100%-100px)] overflow-hidden">
              <p className="text-tr whitespace-nowrap font-normal flex gap-1 text-icongray overflow-hidden text-ellipsis">
                {selectTextToDisplay(program?.type)}
                <span>{program?.order}</span>
              </p>
              <p className="text-ft whitespace-nowrap font-semibold overflow-hidden text-ellipsis">
                {program?.name || t("no_name")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDeleteProgram(true);
                setDeleteProgramObject(program);
              }}
              className="ml-auto mr-0 w-10 h-10 flex justify-center items-center"
            >
              <Bin className="fill-icongray" />
            </button>
          </div>
        );
    }
  };

  const createProgram = (type: number) => {
    const newProgram: ProgramBuild = {
      id: "",
      description: "",
      files: [],
      name: "",
      passingScore: "",
      rewardScore: "",
      type,
      order: programs.length ? Math.max(...programs.map((p) => p.order)) + 1 : 1,
      questions: [{ question: "", answers: [{ answer: "", isTrue: false }] }],
      removeAnswer: [],
      removeCriteria: [],
      removeQuestion: [],
      removeFiles: [],
      errors: {
        description: "",
        files: "",
        name: "",
        questions: [{ question: "", answers: [{ answer: "", isTrue: false }] }],
        passingScore: "",
        rewardScore: "",
      },
    };

    setPrograms([...programs, newProgram]);
    setCurrentProgram(programs?.length);
  };

  return (
    <>
      <Toaster
        header={toaster?.header}
        error={toaster?.error}
        line={toaster?.line}
        isOpen={toaster?.open}
        setIsOpen={() => setToaster((prev) => ({ ...prev, open: false }))}
      />

      <ModalWindow
        active={deleteCourse}
        className="w-[450px]"
        childrenForLabel={<p className="text-ft font-normal text-black">{t("course.del_sure")}</p>}
        headerText={t("course.delete_course")}
        onClick={() => {
          setDeleteCourse(false);
        }}
      >
        <form onSubmit={deleteFormHandler} className="flex justify-end gap-5 mt-6">
          <Button type="button" onClick={() => setDeleteCourse(false)} view="flat" className="w-fit" size="l">
            {t("admin_categories.cancel")}
          </Button>
          <Button type="submit" view="action" className="w-fit before:!bg-errorred [&>*]:text-white" size="l">
            {t("course.delete_course")}
          </Button>
        </form>
      </ModalWindow>

      <ModalWindow
        active={deleteProgram}
        className="w-[450px]"
        childrenForLabel={<p className="text-ft font-normal text-black">{t("course.delete_program")}</p>}
        headerText={t("course.delete_prog")}
        onClick={() => {
          setDeleteProgram(false);
        }}
      >
        <form onSubmit={deleteProgramFormHandler} className="flex justify-end gap-5 mt-6">
          <Button type="button" onClick={() => setDeleteProgram(false)} view="flat" className="w-fit" size="l">
            {t("admin_categories.cancel")}
          </Button>
          <Button type="submit" view="action" className="w-fit before:!bg-errorred [&>*]:text-white" size="l">
            {t("course.delete")}
          </Button>
        </form>
      </ModalWindow>

      <div className="flex flex-col gap-5 h-full container">
        <Link to={"/uploadedcourses"} className="flex items-center gap-2 text-4xl text-textblack font-semibold">
          <Arrow className="fill-textblack rotate-180 h-5 w-5" />
          {course.name || t("no_name")}
        </Link>

        <div className="bg-white w-max p-3 rounded-2xl">
          <div className="bg-primarylight flex p-1 gap-3 rounded-lg">
            <button
              type="button"
              onClick={() => setTab(1)}
              className={`${tab === 1 && active} text-tr rounded-md p-2 font-normal text-textlightgrey`}
            >
              {t("course.description")}
            </button>
            <button
              type="button"
              onClick={() => setTab(2)}
              className={`${tab === 2 && active} text-tr rounded-md p-2 font-normal text-textlightgrey`}
            >
              {t("course.program")}
            </button>
            {/* <button
              type="button"
              onClick={() => setTab(3)}
              className={`${tab === 3 && active} text-tr rounded-md p-2 font-normal text-textlightgrey`}
            >
              {t("course.notes")}
            </button> */}
          </div>
        </div>

        {tab === 1 && (
          <CourseDescriptionComponent
            files={files}
            course={course}
            courseRetrieve={courseRetrieve ? courseRetrieve : ({} as CourseRes)}
            setCourseAndFiles={setCourseAndFiles}
            categories={categories?.data || []}
            setCourse={setCourse}
            setDeleteCourse={setDeleteCourse}
            setLoadingBar={setLoadingBar}
            setFiles={setFiles}
            loadingBar={loadingBar}
            setToaster={setToaster}
          />
        )}

        {/* {tab === 2 && (
          <div className="flex w-full h-full gap-8 relative">
            {programs?.length > 0 && programs[currentProgram] ? (
              <ProgramComponent
                loadingBar={loadingBar}
                topText={`${selectTextToDisplay(programs[currentProgram]?.type)} ${programs[currentProgram]?.order}`}
                program={programs[currentProgram]}
                type={programs[currentProgram]?.type}
                courseId={course?.id}
                programs={programs}
                setPrograms={setPrograms}
                courseRetrieve={courseRetrieve || ({} as CourseRes)}
                currentProgram={currentProgram}
                createExamLessonMutation={createExamLessonMutation}
                updateProgramLessonMutation={updateProgramLessonMutation}
                createTestLessonMutation={createTestLessonMutation}
                updateTestLessonMutation={updateTestLessonMutation}
                createProgramLessonMutation={createProgramLessonMutation}
                updateExamLessonMutation={updateExamLessonMutation}
              />
            ) : (
              <div className="w-full max-w-[850px] h-full" />
            )}
            <div className="flex flex-col gap-2 w-full max-w-[350px]">
              {programs?.map((program, index) => handleDisplayPrograms(program?.type, program, index))}

              <div className={`flex gap-2 items-center bg-white p-5 rounded-3xl h-[82px]`}>
                <Select
                  id="category"
                  size="xl"
                  open={open}
                  className="w-full h-full border-0 [&>div>button]:before:border-0 bg-primarylight rounded-xl"
                  popupClassName="mt-4 flex flex-col gap-2 !rounded-2xl"
                  renderControl={() => {
                    return (
                      <button
                        onClick={() => setOpen(!open)}
                        className="w-full h-full text-ft font-normal flex justify-center items-center gap-2"
                      >
                        {t("course.create_course")}
                        <Arrow className="fill-black rotate-90" />
                      </button>
                    );
                  }}
                  renderPopup={() => {
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            createProgram(1);
                            setOpen(false);
                          }}
                          className="w-full px-4 py-2 h-[57px] flex gap-2 items-center hover:bg-primarylight"
                        >
                          <div className="bg-[#0000000D] rounded-full h-10 w-10 flex items-center justify-center">
                            <Book className="fill-textblack h-4 w-4" />
                          </div>
                          <p className="font-semibold text-st">{t("course.lesson")}</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            createProgram(2);
                            setOpen(false);
                          }}
                          className="w-full px-4 py-2 h-[57px] flex gap-2 items-center hover:bg-primarylight"
                        >
                          <div className="bg-[#30AA6E] rounded-full h-10 w-10 flex items-center justify-center">
                            <Save className="fill-white h-3.5 w-3.5" />
                          </div>
                          <p className="font-semibold text-st">{t("course.test")}</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            createProgram(3);
                            setOpen(false);
                          }}
                          className="w-full px-4 py-2 h-[57px] flex gap-2 items-center hover:bg-primarylight"
                        >
                          <div className="bg-lightorange rounded-full h-10 w-10 flex items-center justify-center">
                            <Star className="fill-textblack h-3.5 w-3.5" />
                          </div>
                          <p className="font-semibold text-st">{t("course.exam")}</p>
                        </button>
                      </>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default CourseCreation;
