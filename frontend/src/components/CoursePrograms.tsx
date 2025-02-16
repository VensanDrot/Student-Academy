import React from "react";
import { CourseDetailProgram } from "../constants/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReactComponent as Book } from "../img/book.svg";
import { GetCorrectedLinkImg } from "../utils/getCorrectedLink";

interface Iprops {
  prog: CourseDetailProgram;
  course_id: string | number;
}

const CoursePrograms: React.FC<Iprops> = ({ prog, course_id }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() =>
        navigate(`/takelesson?id=${prog?.id}&name=${prog?.name}&type=${prog?.type}&course_id=${course_id}`)
      }
      className={`flex flex-col gap-2 w-[318px]`}
    >
      <div className="rounded-xl relative w-[318px] h-[178px] overflow-hidden">
        {prog?.type === 1 && (
          <img
            className="w-[318px] h-[178px] shrink-0 object-cover overflow-hidden rounded-xl"
            src={GetCorrectedLinkImg(prog?.preview)}
            alt={prog?.name}
          />
        )}

        {prog?.type !== 1 && (
          <div className="w-[318px] h-[178px] flex items-center justify-center shrink-0 object-cover overflow-hidden rounded-xl bg-transparent">
            <div className={`p-4 z-40 bg-done rounded-full w-[50px] h-[50px] flex items-center justify-center`}>
              <Book className="fill-white" />
            </div>
          </div>
        )}

        {prog?.type !== 1 && (
          <div className={`absolute inset-0 flex justify-center items-end -bottom-[86px] bg-white`}>
            <div
              className={`w-[179px] h-[133px] rounded-full ${
                prog?.type === 2 ? "bg-[#30AA6E]" : "bg-[#FFBE5C]"
              } opacity-70 blur-[75px]`}
            />
          </div>
        )}
      </div>
      <p className="text-textblack font-semibold text-ft overflow-ellipsis w-[318px]">
        {prog?.order}. {prog?.name}
      </p>
    </button>
  );
};

export default CoursePrograms;
