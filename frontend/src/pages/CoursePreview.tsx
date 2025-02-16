import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ReactComponent as ToRight } from "../img/toright.svg";
import { ReactComponent as Book } from "../img/book.svg";
import { ReactComponent as Clock } from "../img/clock.svg";
import { ReactComponent as Save } from "../img/save.svg";
import CourseView from "../components/CourseView";
import { Button } from "@gravity-ui/uikit";
import { getBusCourse } from "../hooks/fetching/getBusCourses";
import { useQuery } from "@tanstack/react-query";

const CoursePreview = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: currentCourse, isLoading } = useQuery({
    queryKey: ["currentCourse", searchParams.get("id")],
    queryFn: () => getBusCourse(searchParams.get("id") || ""),
    staleTime: Infinity,
    retry: 2,
  });

  return (
    <div className="flex flex-col gap-4 container h-full">
      <Link to={"/"} className="flex items-center gap-2 text-3xl font-semibold">
        <ToRight className="fill-black rotate-180 h-4 w-4" />
        {searchParams.get("name")}
      </Link>
      <div className="flex w-full gap-6">
        <CourseView course={currentCourse} isLoading={isLoading} />
        <div className="w-[373px] flex flex-col gap-5 rounded-3xl p-6 bg-white h-fit">
          <div className="gap-1.5">
            <p className="text-ft font-normal text-icongray">{t("bus_course.price")}</p>
            <p className="font-semibold text-xl flex gap-2 items-center">
              <span className="text-3xl font-semibold">
                {currentCourse?.currency === "UZS" ? "UZS " : "$ "}
                {currentCourse?.cost}
              </span>
              {t("bus_course.per_user")}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-semibold text-st flex gap-2 items-end">{t("bus_course.details_course")}</p>
            <div className="flex flex-col gap-2">
              <p className="text-st font-normal flex gap-2 items-center text-textlightgrey">
                <Book className="fill-icongray h-5 w-5" />
                {currentCourse?.lesson_count} {t("bus_course.lesson")}
              </p>
              {/* <p className="text-st font-normal flex gap-2 items-center text-textlightgrey">
                <Clock className="fill-icongray h-5 w-5" />
                {t("bus_course.takes")} {totalTime?.hours !== "0" && `${totalTime?.hours} ${t("bus_course.hours")}`}
                {totalTime?.minutes} {t("bus_course.min")}
              </p> */}
              <p className="text-st font-normal flex gap-2 items-center text-textlightgrey">
                <Save className="fill-icongray h-5 w-5" />
                {currentCourse?.test_count} {t("bus_course.test")}
              </p>
            </div>
          </div>

          <Button
            onClick={() => {
              currentCourse?.purchased
                ? navigate(`/coursedetails?id=${currentCourse?.id}`)
                : navigate(`/payment?id=${currentCourse?.id}&name=${currentCourse?.name}`);
            }}
            view="action"
            type="button"
            size="xl"
          >
            {currentCourse?.purchased ? t("watch") : t("bus_course.buy")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
