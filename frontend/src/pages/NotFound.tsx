import React from "react";
import { ReactComponent as NotFoundIcon } from "../img/404.svg";
import { useTranslation } from "react-i18next";
import { Button } from "@gravity-ui/uikit";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="w-full h-full items-center justify-center flex">
      <div className="flex flex-col gap-6 self-center w-fit -mt-12">
        <NotFoundIcon className="w-[600px]" />
        <h1 className="text-3xl text-center font-semibold text-textblack">{t("dont_exist")}</h1>
        <Button type="button" onClick={() => navigate("/")} view="action" size="xl" className="w-fit self-center">
          {t("back_to_main")}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
