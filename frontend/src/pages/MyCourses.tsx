import { useEffect, useState, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import CoursePreviewComponent from "../components/CoursePreviewComponent";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// import { CourseOrgAll, getBusCourses } from "../hooks/fetching/getBusCourses";
import { ReactComponent as Zoom } from "../img/zoom.svg";
import DisplayCategories from "../components/DisplayCategories";
import { Loader, TextInput } from "@gravity-ui/uikit";
import { ScrollContext } from "./RootLayoutSigned";
import { getAllCourses, getPurchasedCourses } from "../hooks/fetching/getAllCourses";
import { CourseOrgAll } from "../constants/types";
import { useDebouncedValue } from "../utils/useDebouncedValue";

const MyCourses = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [active, setActive] = useState("");
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<CourseOrgAll[]>([]);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollContainer = useContext(ScrollContext); // Access scrollable container via context

  const { data: myPurchasedCourses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["myPurchasedCourses", page, useDebouncedValue(search, 400), active],
    queryFn: () => getPurchasedCourses(page, 6, search, active),
    retry: 2,
  });

  useEffect(() => {
    setCourses([]);
    setPage(1);
  }, [active, useDebouncedValue(search, 400)]);

  useEffect(() => {
    if (myPurchasedCourses?.courses && !isLoadingCourses) {
      setCourses((prev) => [...prev, ...myPurchasedCourses?.courses]);
      setIsLoadMore(myPurchasedCourses?.courses.length === 6); // Stop loading if fewer items are returned
      setLoadingMore(false);
    }
  }, [myPurchasedCourses]);

  const handleScroll = useCallback(() => {
    if (scrollContainer && isLoadMore && !loadingMore) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

      // Check if the user has scrolled near the bottom of the container
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setLoadingMore(true);
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [scrollContainer, isLoadMore, loadingMore]);

  useEffect(() => {
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollContainer, handleScroll]);

  return (
    <div className="w-full h-auto px-6 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-textblack">{t("bus_course.course")}</h1>

      <TextInput
        value={search}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
        size="l"
        rightContent={<Zoom className="fill-icongray mr-3" />}
        hasClear
      />

      <div className="w-full h-fit">
        <DisplayCategories active={active} setActive={setActive} isActiveJob />
      </div>

      {/* Courses */}
      <div className="w-full">
        {/* grid grid-cols-2 gap-y-6 gap-x-8 */}
        <div className="flex flex-wrap gap-8 gap-y-6 w-fit">
          {courses?.map((course: CourseOrgAll, index) => (
            <CoursePreviewComponent
              key={index}
              index={index}
              course={course as any}
              onDetails={() => {
                navigate(`/coursedetails?id=${course?.id}`);
              }}
            />
          ))}
        </div>

        {/* Loader */}
        {isLoadingCourses && (
          <div className="flex justify-center items-center h-[60px] gap-4">
            <Loader size="l" /> {t("bus_course.loading")}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
