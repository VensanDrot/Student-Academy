import { Button, Select } from "@gravity-ui/uikit";
import React, { SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as Arrow } from "../img/toright.svg";
import { ReactComponent as Card } from "../img/card.svg";
import { ReactComponent as Plus } from "../img/plus.svg";
import { ReactComponent as ADV } from "../img/ADV.svg";
import { useQuery } from "@tanstack/react-query";
import { ReactComponent as Dot } from "../img/point.svg";
import { CardIcon } from "../utils/CardIcons";
import { ReactComponent as Fail } from "../img/failicon.svg";
import ModalWindow from "./ModalWindow";
import { getAllCards } from "../hooks/fetching/getAllCards";
import { useProcessPayment } from "../hooks/mutations/processPayment";

interface IProps {
  courseId: string;
  cardId: string;
  active: boolean;
  selectCard: (e: string | number) => void;
  setIsCreateCard: React.Dispatch<SetStateAction<boolean>>;
  setIsDone: React.Dispatch<SetStateAction<boolean>>;
}

const PaymentProcess: React.FC<IProps> = ({ courseId, active, cardId, selectCard, setIsCreateCard, setIsDone }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [selectedCard, setSelectedCard] = useState({
    id: "",
    type: "",
    card_number: "",
    main: false,
  });

  const { data: availableCards } = useQuery({
    queryKey: ["availableCards", active],
    queryFn: () => getAllCards(courseId),
    retry: 1,
    enabled: !active,
  });

  useEffect(() => {
    setSelectedCard((prev) => ({
      ...prev,
      ...(availableCards?.data?.find((card) => card?.id?.toString() === cardId?.toString()) as any),
    }));
  }, [cardId]);

  const submitPayment = useProcessPayment({
    onSuccess: (data) => {
      setIsDone(true);
      setIsOpenModal(false);
    },
    onError: (error) => {
      console.log(error);
      setIsOpenModal(true);
    },
  });

  const proceedPayment = () => {
    submitPayment.mutate({
      course_id: courseId,
      card_id: selectedCard?.id,
    });
  };

  return (
    <>
      <ModalWindow active={isOpenModal} onClick={() => setIsOpenModal(false)} headerText="">
        <div className="flex flex-col gap-2">
          <Fail className="self-center" />
          <p className="font-semibold text-st text-textblack text-center">{t("payment.cant")}</p>
        </div>
        <Button onClick={proceedPayment} view="outlined" size="xl">
          {t("payment.retry")}
        </Button>
      </ModalWindow>

      <div className="flex flex-col gap-6 w-[650px] self-center">
        <div className="bg-white py-4 px-6 rounded-2xl">
          <Select
            id="category"
            size="xl"
            open={isOpen}
            className="w-full h-full border-0  rounded-xl"
            popupClassName="mt-3 flex flex-col gap-2 w-[calc(100%+48px)] -ml-6 !rounded-2xl h-fit overflow-hidden"
            renderControl={({ onClick }) => {
              if (cardId?.toString() === "-1") {
                return (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                      type="button"
                      className="w-full flex gap-2 items-center h-fit"
                    >
                      <div className="rounded-lg bg-primarylight h-12 w-[64px] flex items-center justify-center">
                        <CardIcon type={selectedCard?.type as any} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-st font-semibold text-textblack text-left">{t("payment.adv")}</p>
                        <p className="text-st font-semibold text-textblack text-left flex items-center gap-1">
                          ${availableCards?.balance || 0}
                        </p>
                      </div>
                    </button>
                    <Arrow className="fill-icongray w-4 h-4 rotate-90" />
                  </div>
                );
              }
              if (cardId) {
                return (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                      type="button"
                      className="w-full flex gap-2 items-center h-fit"
                    >
                      <div className="rounded-lg bg-primarylight h-12 w-[64px] flex items-center justify-center">
                        <CardIcon type={selectedCard?.type as any} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-st font-semibold text-textblack text-left">{selectedCard?.type}</p>
                        <p className="text-st font-semibold text-textblack text-left flex items-center gap-1">
                          {selectedCard?.card_number}{" "}
                          {selectedCard?.main && (
                            <>
                              <Dot className="fill-icongray" /> {t("payment.main")}
                            </>
                          )}
                        </p>
                      </div>
                    </button>
                    <Arrow className="fill-icongray w-4 h-4 rotate-90" />
                  </div>
                );
              }
              return (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                  className="text-ft font-normal w-full flex justify-between items-center gap-2"
                >
                  <div className="w-fit flex gap-2">
                    <div className="rounded-lg bg-primarylight h-12 w-[64px] flex items-center justify-center">
                      <Card className="fill-icongray" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-ft font-normal text-icongray text-left">{t("payment.method")}</p>
                      <p className="text-st font-semibold text-textblack text-left">{t("payment.not_selected")}</p>
                    </div>
                  </div>
                  <Arrow className="fill-icongray w-4 h-4 rotate-90" />
                </button>
              );
            }}
            renderPopup={() => (
              <>
                {availableCards?.data?.map((card) => (
                  <div key={card?.id + card?.card_number} className="py-2 h-fit px-2 rounded-2xl">
                    <button
                      onClick={() => {
                        selectCard(card?.id);
                        setSelectedCard(card as any);
                        setIsOpen(false);
                      }}
                      type="button"
                      className="w-full flex gap-2 items-center h-fit"
                    >
                      <div className="rounded-lg bg-primarylight h-12 w-[64px] flex items-center justify-center">
                        <CardIcon type={card?.type as any} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-st font-semibold text-textblack text-left">{card?.type}</p>
                        <p className="text-st font-normal text-icongray text-left">{card?.card_number}</p>
                      </div>
                    </button>
                  </div>
                ))}
                <div className="py-2 h-fit px-2 rounded-2xl">
                  <button
                    onClick={() => {
                      selectCard("-1");
                      setSelectedCard({ id: "-1", type: "adv", card_number: "", main: false });
                      setIsOpen(false);
                    }}
                    type="button"
                    className="w-full flex gap-2 items-center h-fit"
                  >
                    <div className="rounded-lg bg-primarylight h-12 w-[64px] flex items-center justify-center">
                      <ADV className="fill-icongray" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-st font-semibold text-textblack text-left">{t("payment.adv")}</p>
                      <p className="text-st font-normal text-icongray text-left">${availableCards?.balance || 0}</p>
                    </div>
                  </button>
                </div>
                <div className="py-2 h-fit px-2 rounded-2xl">
                  <button
                    onClick={() => {
                      setIsCreateCard(true);
                      setIsOpen(false);
                      selectCard("");
                    }}
                    type="button"
                    className="w-full flex gap-2 items-center h-fit"
                  >
                    <div className="rounded-lg bg-primarylight h-12 w-[64px] flex items-center justify-center">
                      <Plus className="fill-icongray" />
                    </div>
                    <p className="text-st font-normal text-icongray text-left">{t("payment.new_card")}</p>
                  </button>
                </div>
              </>
            )}
          ></Select>
        </div>

        <div className="bg-white py-4 px-6 rounded-2xl flex flex-col gap-4">
          <div className="bg-primarylight rounded-2xl p-4 gap-4 flex flex-col">
            <div className="flex justify-between items-center">
              <p className="text-st font-normal text-textblack">{t("payment.total")}</p>
              <p className="text-2xl font-semibold text-textblack">${availableCards?.price}</p>
            </div>
          </div>
          <Button type="button" size="xl" view="action" disabled={!cardId} onClick={proceedPayment}>
            {t("payment.pay")} ${availableCards?.price}
          </Button>
        </div>
      </div>
    </>
  );
};

export default PaymentProcess;
