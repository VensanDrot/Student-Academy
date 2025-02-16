import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { ReactComponent as ToRight } from "../img/toright.svg";
import { ReactComponent as Warning } from "../img/notice.svg";

import { useQuery } from "@tanstack/react-query";

import CoursePrograms from "../components/CoursePrograms";
import { Loader } from "@gravity-ui/uikit";
import { getClientCourseDetails } from "../hooks/fetching/getCourseDetails";

const CourseDetailsCl = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const { data: courseDetail, isLoading } = useQuery({
    queryKey: ["courseDetail", searchParams.get("id")],
    queryFn: () => getClientCourseDetails(searchParams.get("id") || ""),
    retry: 1,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Link to={"/mycourses"} className="text-st font-normal text-icongray flex items-center gap-2">
          <ToRight className="fill-icongray rotate-180" /> {t("cl_courses.back")}
        </Link>
        <h1 className="font-semibold text-3xl text-textblack">
          {searchParams.get("name") || courseDetail?.course?.name}
        </h1>
      </div>

      {isLoading ? (
        <Loader size="l" className="self-center" />
      ) : (
        <div className="flex flex-wrap gap-6 w-fit">
          {courseDetail?.programs?.map((prog) => (
            <CoursePrograms key={prog?.id + prog?.name} course_id={courseDetail?.course?.id} prog={prog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDetailsCl;
