import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ToRight } from "../img/toright.svg";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ReactComponent as SadFace } from "../img/sadface.svg";
import { ReactComponent as Celebration } from "../img/Party.svg";
import { ReactComponent as Clock } from "../img/clock.svg";
import { Button } from "@gravity-ui/uikit";

const CelebrationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scored = searchParams.get("res");
  const need = searchParams.get("req");
  const retries = searchParams.get("ret");
  const timeLeft = searchParams.get("time");
  const max = searchParams.get("max");
  const passed = (scored || 0) >= (need || 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-fit relative">
        <Link
          to={`/coursedetails?id=${searchParams.get("course_id")}` || "/"}
          className="flex gap-2 items-center text-st font-normal relative w-[200px]"
        >
          <div className="w-10 h-10 flex justify-center items-center bg-white rounded-full">
            <ToRight className="rotate-180 fill-black mr-[2px] w-3 h-3" />
          </div>
          {t("cl_courses.back")}
        </Link>
        <h1 className="font-semibold w-fit m-auto absolute inset-0 self-center text-3xl text-center">
          {t("cl_courses.results")}
        </h1>
      </div>

      <div className="flex flex-col gap-6 relative p-6 pt-20 bg-white w-[512px] self-center mt-[200px] rounded-3xl">
        <div className="absolute bottom-[80%] right-0 left-0 m-auto p-2 w-fit h-fit rounded-full bg-[#EDEDED]">
          <div className="!w-[96px] bg-white rounded-full flex justify-center items-center !h-[96px]">
            {passed ? <Celebration /> : <SadFace />}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-textblack font-semibold text-2xl text-center">
            {t(passed ? "cl_courses.suc" : "cl_courses.fail")}
          </h1>
          <p className="text-st text-textlightgrey font-normal self-center">
            {t("cl_courses.got")}{" "}
            <span className={`${passed ? "text-done" : "text-errorred"}`}>
              {scored} {t("out")} {max}
            </span>{" "}
            {t("cl_courses.points")}
          </p>
        </div>
        {passed ? (
          <Button
            view="action"
            onClick={() => navigate(`/coursedetails?id=${searchParams.get("course_id")}`)}
            className="w-fit self-center"
            size="xl"
          >
            {t("cl_courses.back_less")}
          </Button>
        ) : (
          (Number(retries) || 1) > 0 && (
            <Button
              view="action"
              onClick={() =>
                navigate(
                  `/takelesson?id=${searchParams.get("tid")}&type=${searchParams.get(
                    "type"
                  )}&course_id=${searchParams.get("course_id")}`
                )
              }
              className="w-fit self-center"
              size="xl"
            >
              {t("cl_courses.retry")}
            </Button>
          )
        )}

        {!passed && retries === "0" && (
          <div className="flex gap-3 p-4 rounded-2xl bg-primarylight items-center">
            <Clock className="fill-icongray w-5 h-5 shrink-0" />{" "}
            <p className="text-ft text-textblack font-normal">
              {t("cl_courses.hours")}
              {timeLeft?.split(":")[0]}
              {t("cl_courses.rem_hours")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CelebrationPage;
