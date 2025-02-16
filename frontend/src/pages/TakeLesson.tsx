import React, { useEffect, useState } from "react";
import { ReactComponent as ToRight } from "../img/toright.svg";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClientLessonDetails } from "../hooks/fetching/getClientLesson";
import { Button, Loader } from "@gravity-ui/uikit";
import LessonComponent from "../components/LessonComponent";
// import { getClientTestDetails } from "../hooks/fetching/getClientTest";
import Toaster from "../components/Toaster";
import { getClientTestDetails } from "../hooks/fetching/getClientTest";
import TestingComponent from "../components/TestingComponent";
// import TestingComponent from "../components/TestingComponent";

export type AnswerState = {
  id: number; // question ID
  answers: number[]; // array of selected answer IDs
  error: string;
};

const TakeLesson = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activated, setActivated] = useState(["2", "3", "4"].includes(searchParams.get("state") || ""));
  const [currentFile, setCurrentFile] = useState({
    id: 0,
    file_path: "",
    file_type: "",
  });
  const [answers, setAnswers] = useState<AnswerState[]>([]);

  const { data: lessonDetails, isLoading } = useQuery({
    queryKey: ["lessonDetails", searchParams.get("id")],
    queryFn: () => getClientLessonDetails(searchParams.get("id") || "", searchParams.get("course_id") || ""),
    retry: 1,
    enabled: !!searchParams.get("id") && searchParams.get("type") === "1",
  });

  const { data: testDetails, isLoading: isLoadingTest } = useQuery({
    queryKey: ["testDetails", searchParams.get("id")],
    queryFn: () => getClientTestDetails(searchParams.get("id") || ""),
    retry: 1,
    enabled: !!searchParams.get("id") && searchParams.get("type") === "2",
  });

  useEffect(() => {
    if (lessonDetails && !isLoading && lessonDetails?.lesson_files[0]) {
      setCurrentFile(lessonDetails?.lesson_files[0]);
    }
    if (testDetails && !isLoadingTest) {
      setAnswers(testDetails?.questions?.map((questions) => ({ id: questions?.id, answers: [], error: "" })));
    }

    // if (testDetails?.max_score && testDetails?.user_score) {
    //   navigate(
    //     `/completedtest?course_id=${searchParams.get("course_id") || ""}&tid=${searchParams.get(
    //       "id"
    //     )}&type=${searchParams.get("type")}&req=${testDetails?.passing_score}&res=${testDetails?.user_score}&max=${
    //       testDetails?.max_score
    //     }`
    //   );
    // }
  }, [isLoading, lessonDetails?.lesson_files[0], isLoadingTest, testDetails]); //

  return (
    <>
      <Toaster header={t("def_err")} line={error} isOpen={isOpen} setIsOpen={setIsOpen} error />
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <Link
            to={`/coursedetails?id=${searchParams.get("course_id")}` || "/"}
            className="flex gap-2 items-center text-st font-normal relative w-[200px]"
          >
            <div className="w-10 h-10 flex justify-center items-center bg-white rounded-full">
              <ToRight className="rotate-180 fill-black mr-[2px] w-3 h-3" />
            </div>
            {t("cl_courses.back")}
          </Link>
          <h1 className="font-semibold text-3xl text-center">{searchParams.get("name") || lessonDetails?.name}</h1>

          {lessonDetails?.next_id ? (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/takelesson?id=${lessonDetails?.next_id}&name=${lessonDetails?.next_name}&type=${
                    lessonDetails?.next_type
                  }&course_id=${searchParams.get("course_id")}`
                )
              }
              className="flex gap-2 items-center text-st font-normal w-[200px]"
            >
              {t("cl_courses.next")}
              <div className="w-10 h-10 flex justify-center items-center bg-white rounded-full">
                <ToRight className="fill-black ml-[2px] w-3 h-3" />
              </div>
            </button>
          ) : (
            <div className="w-[200px]" />
          )}
        </div>

        {isLoading || isLoadingTest ? (
          <Loader className="self-center" size="l" />
        ) : (
          <>
            <div className="flex flex-col self-center max-w-[968px] gap-4">
              {searchParams.get("type") === "1" && lessonDetails && (
                <div className="w-[1000px] flex flex-col self-center gap-4">
                  <LessonComponent
                    currentFile={currentFile}
                    setCurrentFile={setCurrentFile}
                    course_id={searchParams.get("course_id") || ""}
                    lessonDetails={lessonDetails as any}
                  />
                </div>
              )}

              {searchParams.get("type") === "2" && testDetails && (
                <TestingComponent
                  answers={answers}
                  setAnswers={setAnswers}
                  questions={testDetails?.questions as any}
                  setIsOpen={setIsOpen}
                  setError={setError}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TakeLesson;
