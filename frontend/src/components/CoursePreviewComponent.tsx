import React from "react";
import { Button } from "@gravity-ui/uikit";
import { Pagination } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { CourseOrgActive } from "../constants/types";

import "swiper/css";
import "swiper/css/pagination";
import { GetCorrectedLink, GetCorrectedLinkImg } from "../utils/getCorrectedLink";

interface IProps {
  index: number | string;
  onDetails: () => void;
  onBuy?: () => void;
  text?: React.ReactNode;
  course: CourseOrgActive | CourseOrgActive;
}

const CoursePreviewComponent: React.FC<IProps> = ({ index, text, course, onDetails, onBuy }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 p-6 w-[450px] bg-white relative rounded-3xl">
      <div className="h-[226px] w-full relative">
        <Swiper
          pagination={{
            clickable: true,
            el: `.swiper-pagination${index}`,

            renderBullet: function (index: number, className: string) {
              return '<span class="!h-2 !w-2 rounded-full bg-black ' + className + '"></span>';
            },
          }}
          spaceBetween={20}
          modules={[Pagination]}
          className="w-full h-full"
        >
          {course?.course_files?.map((file, index: number) => (
            <SwiperSlide className="rounded-xl" key={`${file?.id}/${file.file_path}`}>
              <img
                className="w-full h-full rounded-xl"
                loading={index === 0 ? "eager" : "lazy"}
                src={GetCorrectedLinkImg(file?.file_path)}
                alt={String(file?.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div
          className={`${
            course?.course_files?.length < 2 && "!hidden"
          } swiper-pagination${index} z-10 [&>.swiper-pagination-bullet]:!m-auto [&>.swiper-pagination-bullet]:!bg-black !absolute !bottom-4 !right-4 !p-2.5 !rounded-[40px] !flex !gap-2 !left-auto !w-fit !bg-white !h-auto`}
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-ft text-linkblue font-semibold">{course?.category}</p>
        <p className="text-2xl text-black font-semibold">{course?.name}</p>
        <p className="text-xl text-textlightgrey font-semibold">
          {text || (
            <>
              ${course?.cost} <span className="text-st font-normal text-icongray"></span>
            </>
          )}
        </p>
      </div>
      <div className="flex gap-3">
        <Button type="button" onClick={onDetails} className="w-full" view="normal" size="xl">
          {t("bus_course.details")}
        </Button>
        {onBuy && (
          <Button type="button" onClick={onBuy} className="w-full" view="action" size="xl">
            {t("bus_course.buy")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CoursePreviewComponent;
