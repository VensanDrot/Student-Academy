import React, { SetStateAction, useRef } from "react";
import { DefaultFile } from "../constants/types";
import { ReactComponent as ToRight } from "../img/toright.svg";
import { ClientLessonFull } from "../hooks/fetching/getClientLesson";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TestVideoPlayerJS from "./PartialVideo";
import { GetCorrectedLink, GetCorrectedLinkImg } from "../utils/getCorrectedLink";

interface IProps {
  lessonDetails: ClientLessonFull;
  currentFile: DefaultFile;
  course_id: string | number;
  setCurrentFile: React.Dispatch<SetStateAction<DefaultFile>>;
}

const LessonComponent: React.FC<IProps> = ({ lessonDetails, currentFile, course_id, setCurrentFile }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -120, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 120, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="!aspect-video w-full">
        {currentFile?.file_type?.includes("video") ? (
          // <PlayerJS videoUrl={currentFile?.file_path} previewImage={""} />
          <TestVideoPlayerJS videoUrl={currentFile?.file_path} previewImage={""} />
        ) : (
          <img
            className="relative rounded-2xl overflow-hidden !aspect-video !w-full !h-full"
            src={GetCorrectedLinkImg(currentFile?.file_path)}
            alt="img"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={scrollLeft}
          className="w-10 h-10 shrink-0 flex justify-center items-center bg-white rounded-full"
        >
          <ToRight className="rotate-180 fill-black mr-[2px] w-3 h-3" />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex gap-2 w-full overflow-hidden relative   scrollbar-hide"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          {lessonDetails?.lesson_files?.map((file: DefaultFile) => {
            if (file?.file_type?.includes("video"))
              return (
                <button
                  key={file?.id + file?.file_path}
                  onClick={() => setCurrentFile(file)}
                  className={`w-[98px] shrink-0 duration-300 h-fit !aspect-video rounded-lg relative overflow-hidden opacity-70 ${
                    currentFile?.id?.toString() === file?.id?.toString() &&
                    "border-[2px] !w-[120px] h-[67px] border-iconorange !opacity-100"
                  }`}
                >
                  <video
                    className={`!w-full !aspect-video rounded-lg !h-full object-cover pointer-events-none`}
                    src={GetCorrectedLink(file?.file_path)}
                  />
                </button>
              );
            return (
              <button
                key={file?.id + file?.file_path}
                onClick={() => setCurrentFile(file)}
                className={`w-[98px] shrink-0 duration-300 h-fit !aspect-video rounded-lg relative overflow-hidden opacity-70 ${
                  currentFile?.id === file?.id && "border-[2px] !w-[120px] border-iconorange !opacity-100"
                }`}
              >
                <img
                  className={`!w-full !aspect-video rounded-lg !h-full`}
                  src={GetCorrectedLinkImg(file?.file_path)}
                  alt="img"
                />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={scrollRight}
          className="w-10 h-10 shrink-0 flex justify-center items-center bg-white rounded-full"
        >
          <ToRight className="fill-black ml-[2px] w-3 h-3" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">{t("bus_course.description")}</h1>
        <p className="text-st font-normal text-textlightgrey">{lessonDetails?.description}</p>
      </div>
      <div className="flex gap-4 justify-between w-full self-center">
        {lessonDetails?.prev_id ? (
          <button
            onClick={() =>
              navigate(
                `/takelesson?id=${lessonDetails?.prev_id}&name=${lessonDetails?.prev_name}&type=${lessonDetails?.prev_type}`
              )
            }
            type="button"
            className="p-4 flex gap-4 rounded-2xl bg-white w-[50%]"
          >
            <div className="w-10 h-10 flex justify-center items-center bg-primarylight rounded-full">
              <ToRight className="rotate-180 fill-black mr-[2px] w-3 h-3" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-normal text-tr text-icongray">{t("cl_courses.prev")}</p>
              <p className="text-ft font-semibold text-textblack">{lessonDetails?.prev_name}</p>
            </div>
          </button>
        ) : (
          <></>
        )}
        {lessonDetails?.next_id ? (
          <button
            onClick={() =>
              navigate(
                `/takelesson?id=${lessonDetails?.next_id}&name=${lessonDetails?.next_name}&type=${lessonDetails?.next_type}&course_id=${course_id}`
              )
            }
            type="button"
            className="p-4 flex gap-4 rounded-2xl bg-white ml-auto w-[50%] self-end justify-end"
          >
            <div className="flex flex-col gap-1 justify-end">
              <p className="font-normal text-tr text-icongray text-right">{t("cl_courses.next")}</p>
              <p className="text-ft font-semibold text-textblack text-right">{lessonDetails?.next_name}</p>
            </div>
            <div className="w-10 h-10 flex justify-center items-center bg-primarylight rounded-full">
              <ToRight className="fill-black mr-[2px] w-3 h-3" />
            </div>
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default LessonComponent;
