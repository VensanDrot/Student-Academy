import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as Star } from "../img/star.svg";
import { ReactComponent as Save } from "../img/save.svg";
import { ReactComponent as Clock } from "../img/clock.svg";

import { Loader } from "@gravity-ui/uikit";
import { CurrentCourse, Program } from "../constants/types";
import TestVideoPlayerJs from "../components/PartialVideo";

interface IProps {
  course: CurrentCourse | undefined;
  isLoading: boolean;
}

const CourseView: React.FC<IProps> = ({ course, isLoading }) => {
  const { t } = useTranslation();

  const whatToDisplay = (program: Program, key: string) => {
    switch (program?.type) {
      case 1:
        return (
          <div key={key} className="bg-white w-full p-4 h-[57px] flex gap-2 items-center rounded-2xl justify-between">
            <div className="flex gap-2 items-center">
              <div className="bg-[#0000000D] rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                {program?.order}
              </div>
              <p className="font-semibold text-st text-icongray w-fit shrink-0">
                {t("course.lesson")} {program?.order}.
              </p>
              <p className="font-semibold text-st text-black overflow-ellipsis w-full h-[18px] overflow-hidden">
                {program?.name}
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div key={key} className="bg-white w-full p-4 h-[57px] flex gap-2 items-center rounded-2xl justify-between">
            <div className="flex gap-2 items-center">
              <div className="bg-[#30AA6E] rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                <Save className="fill-white h-3.5 w-3.5" />
              </div>
              <p className="font-semibold text-st text-textlightgrey w-fit shrink-0">
                {t("course.test")} {program?.order}.
              </p>
              <p className="font-semibold text-st text-black overflow-ellipsis h-[18px] overflow-hidden">
                {program?.name}
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div key={key} className="bg-white w-full p-4 h-[57px] flex gap-2 items-center rounded-2xl justify-between">
            <div className="flex gap-2 items-center">
              <div className="bg-lightorange rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                <Star className="fill-textblack h-3.5 w-3.5" />
              </div>
              <p className="font-semibold text-st text-icongray w-fit shrink-0">{t("course.exam")}.</p>
              <p className="font-semibold text-st text-black overflow-ellipsis h-[18px] overflow-hidden">
                {program?.name}.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[800px] gap-8 h-fit">
      {isLoading ? (
        <Loader className="self-center" size="l" />
      ) : (
        <>
          {/* <PlayerJS
            previewImage={course?.course_files?.find((item) => item?.file_type?.includes("image"))?.file_path}
            videoUrl={course?.course_files?.find((item) => item?.file_type?.includes("video"))?.file_path}
          /> */}
          <TestVideoPlayerJs
            videoUrl={course?.course_files?.find((item) => item?.file_type?.includes("video"))?.file_path}
            previewImage={course?.course_files?.find((item) => item?.file_type?.includes("image"))?.file_path || ""}
          />

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold">{t("bus_course.description")}</h1>
            <p className="text-st font-normal text-textlightgrey whitespace-pre-wrap">{course?.description}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">{t("bus_course.content")}</h1>

            <div className="flex flex-col gap-2">
              {course?.programs?.map((program, index) =>
                whatToDisplay(program, `${program?.name}${program?.id}${index}`)
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseView;
