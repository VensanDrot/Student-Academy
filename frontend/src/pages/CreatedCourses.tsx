import React, { useState } from "react";
import { RenderRowActionsProps } from "@gravity-ui/uikit";
import { useTranslation } from "react-i18next";
import TopPageSearch from "../components/TopPageSearch";
import TableComponent from "../components/TableComponent";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "../utils/useDebouncedValue";
// import { getAdminCourses } from "../hooks/fetching/getAdminCourses";
import { ReactComponent as UsersIcon } from "../img/employees.svg";
import { ReactComponent as ToRight } from "../img/toright.svg";
import StatusComponent from "../components/StatusComponent";
import { useNavigate } from "react-router-dom";
import { GetCorrectedLink, GetCorrectedLinkImg } from "../utils/getCorrectedLink";
import { getCreatedCourses } from "../hooks/fetching/getCourses";

const CreatedCourses = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses", page, recordsPerPage, useDebouncedValue(search, 400)],
    queryFn: () => getCreatedCourses(page, recordsPerPage, search),
    retry: 1,
  });

  const columns = [
    {
      id: "name",
      name: t("admin_courses.name"),
      template: (item: any) => (
        <div className="flex gap-1 items-center">
          <img className="h-12 w-12 rounded-lg object-cover" src={GetCorrectedLinkImg(item?.preview)} alt="img" />
          <div className="flex flex-col gap-1 h-full">
            <span className="text-tr font-semibold text-textblack">{item.name}</span>
            <span className="text-tr font-normal text-golden">{item.category}</span>
          </div>
        </div>
      ),
    },
    {
      id: "users",
      name: t("admin_courses.users"),
      template: (item: any) => (
        <span className="flex gap-2 items-center text-tr font-normal text-icongray">
          <UsersIcon className="fill-icongray w-4" />
          {item.users}
        </span>
      ),
    },
    {
      id: "status",
      name: t("admin_courses.status"),
      template: (item: any) => <StatusComponent active={item.state} />,
    },
  ];

  const RowAction = ({ item }: RenderRowActionsProps<any>) => {
    return (
      <button
        key={item.id}
        className="w-[50px] h-full flex justify-center items-center"
        onClick={() => navigate(`/createcourse?id=${item.id}&name=${item.name}`)}
      >
        <ToRight className="fill-icongray" />
      </button>
    );
  };

  return (
    <div className="w-full h-full px-6 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-textblack">{t("admin_courses.courses")}</h1>

      <TopPageSearch
        id="search"
        placeholder={t("admin_courses.course_name")}
        value={search}
        button={t("admin_courses.add_new")}
        onChange={(e) => setSearch(e.target.value)}
        onButtonClick={() => navigate("/createcourse")}
      />

      <TableComponent
        isLoading={isLoading}
        data={courses?.data || []}
        columns={columns}
        page={page}
        perPage={recordsPerPage}
        setPage={setPage}
        setPerPage={setRecordsPerPage}
        totalPages={(courses?.pages || 1) * recordsPerPage}
        className="w-full [&>table]:!w-full"
        rowActionRender={RowAction}
      />
    </div>
  );
};

export default CreatedCourses;
