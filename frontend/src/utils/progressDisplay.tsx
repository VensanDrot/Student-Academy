import { useTranslation } from "react-i18next";

export const ProgressDisplay = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  switch (status) {
    case "success":
      return (
        <div className="rounded-md py-1 px-2.5 flex items-center justify-center bg-done text-white">
          {t("analytics.suc")}
        </div>
      );
    case "failed":
      return (
        <div className="rounded-md py-1 px-2.5 flex items-center justify-center bg-errorred text-white">
          {t("analytics.failed")}
        </div>
      );
    default:
      return (
        <div className="rounded-md py-1 px-2.5 flex items-center justify-center bg-primarygrey text-icongray">
          {t("analytics.not_started")}
        </div>
      );
  }
};
