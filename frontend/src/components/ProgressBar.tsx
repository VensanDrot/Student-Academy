import { Button, Progress } from "@gravity-ui/uikit";
import React from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  totalFiles: number | string;
  current: number | string;
  totalSize: number | string;
  uploadedSize: string | number;
  percentage: number | string;
  onClick?: () => void;
}

const ProgressBar: React.FC<IProps> = ({ totalFiles, current, totalSize, uploadedSize, percentage, onClick }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-primarylight p-4 rounded-xl flex flex-col gap-4 w-full">
      <div className="flex gap-3 items-center">
        <p className="text-ft font-semibold">
          {t("course.uploaded")} {current} {t("course.out")} {totalFiles}
        </p>
        <p className="text-ft font-semibold text-[#30AA6E]">
          {uploadedSize} {t("course.out")} {totalSize} {t("course.mb")} ({percentage}%)
        </p>
        {onClick && (
          <Button type="button" onClick={onClick} className="self-end ml-auto mr-0" view="normal" size="s">
            {t("course.cancel")}
          </Button>
        )}
      </div>
      <Progress theme="success" className="w-full [&>div]:bg-[#30AA6E]" value={Number(percentage)} size="s" />
    </div>
  );
};

export default ProgressBar;
