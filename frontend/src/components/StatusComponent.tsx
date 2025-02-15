import React from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  active: boolean;
}

const StatusComponent: React.FC<IProps> = ({ active }) => {
  const { t } = useTranslation();

  if (active)
    return (
      <span className="px-2 py-[1px] rounded-[3px] bg-sucgreen text-sugreentext font-normal text-tr">
        {t("admin_courses.active")}
      </span>
    );
  return (
    <span className="px-2 py-[1px] rounded-[3px] bg-negred text-negredtext font-normal text-tr">
      {t("admin_courses.inactive")}
    </span>
  );
};

export default StatusComponent;
