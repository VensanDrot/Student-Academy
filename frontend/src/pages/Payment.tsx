import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ReactComponent as ToRight } from "../img/toright.svg";

// import PaymentProcess from "../components/PaymentProcess";
import AddNewCard from "../components/AddNewCard";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "../utils/useDebouncedValue";
import { ReactComponent as Success } from "../img/success.svg";
import { Button } from "@gravity-ui/uikit";
import PaymentProcess from "../components/PaymentProcess";

const Payment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAddCard, setIsAddCard] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [courseData, setCourseData] = useState({
    id: searchParams.get("id") || "",
    name: searchParams.get("name") || "",
    price: "",
    cardId: "",
  });

  return (
    <>
      <AddNewCard active={isAddCard} onClose={() => setIsAddCard(false)} />
      <div className="flex flex-col gap-4 container h-full w-auto min-w-[600px] max-w-[850px] m-auto">
        <div className="gap-1.5 flex flex-col">
          <Link
            to={`${searchParams.get("back") || "/"}`}
            className="flex items-center gap-2 text-st font-semibold text-icongray"
          >
            <ToRight className="fill-icongray rotate-180 h-4 w-4" />
            {t("payment.back")}
          </Link>
          <h1 className="font-semibold text-3xl text-textblack">{courseData?.name}</h1>
        </div>

        {isDone ? (
          <>
            <div className="flex flex-col self-center gap-4 w-[440px] mt-6 items-center bg-white rounded-2xl p-6">
              <div className="self-center flex flex-col gap-2">
                <Success className="self-center" />
                <h1 className="font-semibold text-st">{t("payment.paid")}</h1>
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={() => navigate(`${searchParams.get("back") || "/"}`)}
                view="outlined"
                size="xl"
              >
                {t("payment.back_to")}
              </Button>
            </div>
          </>
        ) : (
          <>
            <PaymentProcess
              active={isAddCard}
              courseId={courseData?.id}
              cardId={courseData?.cardId}
              selectCard={(e: any) => setCourseData((prev) => ({ ...prev, cardId: e.toString() }))}
              setIsCreateCard={setIsAddCard}
              setIsDone={setIsDone}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Payment;
