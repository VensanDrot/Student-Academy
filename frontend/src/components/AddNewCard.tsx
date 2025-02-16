import React, { useState } from "react";
import { ReactComponent as ExitB } from "../img/plus.svg";
import { useTranslation } from "react-i18next";
import { Button, TextInput } from "@gravity-ui/uikit";
import { ReactComponent as Humo } from "../img/Humo.svg";
import { ReactComponent as Visa } from "../img/visa.svg";
import { ReactComponent as UzCard } from "../img/Uzcard.svg";
import { ReactComponent as MasterCard } from "../img/mastercard.svg";
import PhoneInputComp from "./PhoneInput";
import { DateField } from "@gravity-ui/date-components";
import { useCreateCardMutation } from "../hooks/mutations/createCard";
import { ReactComponent as Success } from "../img/success.svg";

interface IProps {
  active: boolean;
  onClose: () => void;
}

const AddNewCard: React.FC<IProps> = ({ active, onClose }) => {
  const { t } = useTranslation();
  const [isName, setIsName] = useState(true);
  const [iconToDisplay, setIconToDisplay] = useState<React.ReactNode>();
  const [isVerification, setIsVerification] = useState(false);
  const [card, setCard] = useState({
    card: "",
    exp: "",
    phoneNumber: "",
    cvv: "",
    name: "",
    verification: "",
    type: "",
  });
  const [errors, setErrors] = useState({
    card: "",
    exp: "",
    phoneNumber: "",
    cvv: "",
    name: "",
    verification: "",
    type: "",
  });

  const busCardMutation = useCreateCardMutation({
    onSuccess: (data) => {
      setIsVerification(true);
      onClose();
      setCard({
        name: "",
        phoneNumber: "",
        card: "",
        exp: "",
        cvv: "",
        verification: "",
        type: "",
      });
      setIsName(true);
    },
    onError: (error) => {
      setErrors((prev) => ({ ...prev, type: error?.response?.data?.error?.message || t("def_err") }));
    },
  });

  const choseIcon = (e: string) => {
    switch (true) {
      case e.slice(0, 2).includes("98"): {
        setIsName(false);
        setIconToDisplay(<Humo className="mr-1" />);
        setCard((prev) => ({ ...prev, type: "humo" }));
        break;
      }
      case e.slice(0, 2).includes("86"): {
        setIsName(false);
        setIconToDisplay(<UzCard className="mr-1" />);
        setCard((prev) => ({ ...prev, type: "uzcard" }));
        break;
      }
      case e.slice(0, 1).includes("5"): {
        setIsName(true);
        setIconToDisplay(<MasterCard className="mr-1" />);
        setCard((prev) => ({ ...prev, type: "master" }));
        break;
      }
      case e.slice(0, 4).includes("2221"): {
        setIsName(true);
        setIconToDisplay(<MasterCard className="mr-1" />);
        setCard((prev) => ({ ...prev, type: "master" }));
        break;
      }
      case e.slice(0, 4).includes("2720"): {
        setIsName(true);
        setIconToDisplay(<MasterCard className="mr-1" />);
        setCard((prev) => ({ ...prev, type: "master" }));
        break;
      }
      case e.slice(0, 1).includes("4"): {
        setIsName(true);
        setIconToDisplay(<Visa className="mr-1" />);
        setCard((prev) => ({ ...prev, type: "visa" }));
        break;
      }
      default: {
        setIconToDisplay(<></>);
        setCard((prev) => ({ ...prev, type: "" }));
      }
    }
  };

  const handleCreation = () => {
    let err = 0;
    let obj = {} as any;
    setErrors({
      card: "",
      exp: "",
      phoneNumber: "",
      cvv: "",
      name: "",
      verification: "",
      type: "",
    });

    if (!card?.card?.trim() || card?.card?.trim()?.length !== 16) {
      setErrors((prev) => ({ ...prev, card: t("payment.pan_err") }));
      err++;
    }

    if (!card?.exp?.trim()) {
      setErrors((prev) => ({ ...prev, exp: t("payment.exp_err") }));
      err++;
    } else {
      const [month, year] = card.exp.split("/");
      const currentYear = new Date().getFullYear() % 100; // Last two digits of the current year
      const currentMonth = new Date().getMonth() + 1;

      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        setErrors((prev) => ({ ...prev, exp: t("payment.expired") }));
        err++;
      }
    }

    if (isName) {
      if (!card?.cvv?.trim() || card?.cvv?.trim()?.length !== 3) {
        setErrors((prev) => ({ ...prev, cvv: t("payment.cvv_err") }));
        err++;
      }
      if (!card?.name?.trim()) {
        err++;
        setErrors((prev) => ({ ...prev, name: t("payment.name_err") }));
      }
      obj["cvv"] = card?.cvv;
      obj["holder_name"] = card?.name;
    } else {
      if (!card?.phoneNumber?.trim() || card?.phoneNumber?.trim().length < 7) {
        setErrors((prev) => ({ ...prev, phoneNumber: t("payment.phone_err") }));
        err++;
      }
      obj["phone_number"] = card?.phoneNumber?.startsWith("+") ? card.phoneNumber.slice(1) : card?.phoneNumber;
    }

    if (err > 0) return;

    if (!card?.type) return setErrors((prev) => ({ ...prev, type: t("payment.type_err") }));

    obj["exp"] = card?.exp;
    obj["pan"] = card?.card;
    obj["type"] = card?.type;
    obj["return_url"] = window?.location?.href;

    busCardMutation.mutate(obj);
  };

  const formatDateTime = (dateTime: any) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
  };

  const handleCardInputs = (id: string, value: string | number) => {
    setCard((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div
      className={`w-screen h-[200%] absolute duration-300 inset-0 z-[1000000] m-auto bg-modalbg flex justify-center items-center ${
        !active && "right-[-200%]"
      }`}
    >
      {isVerification ? (
        <div className="flex flex-col self-center gap-4 w-[440px] mt-6 items-center bg-white rounded-2xl p-6">
          <div className="self-center flex flex-col gap-2">
            <Success className="self-center" />
            <h1 className="font-semibold text-st">{t("payment.card_binded")}</h1>
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              onClose();
              setCard({
                name: "",
                phoneNumber: "",
                card: "",
                exp: "",
                cvv: "",
                verification: "",
                type: "",
              });
              setIsName(true);
            }}
            view="outlined"
            size="xl"
          >
            {t("payment.back_to")}
          </Button>
        </div>
      ) : (
        <div className={`bg-white rounded-2xl px-8 py-6 w-[500px] flex flex-col gap-6`}>
          <div className="flex justify-between items-center gap-2">
            <div className={`flex flex-col gap-2`}>
              <h1 className="text-st font-semibold text-textblack">{t("payment.add_new_card")}</h1>
            </div>
            <button
              onClick={() => {
                onClose();
                setCard({
                  name: "",
                  phoneNumber: "",
                  card: "",
                  exp: "",
                  cvv: "",
                  verification: "",
                  type: "",
                });
                setIsName(true);
              }}
              type="button"
              className="flex justify-center items-center"
            >
              <ExitB className="fill-textblack rotate-45" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-tr font-normal text-textlightgrey">{t("payment.card_number")}</p>
              <TextInput
                id="card"
                controlProps={{ maxLength: 19 }}
                value={card?.card?.replace(/(\d{4})(?=\d)/g, "$1 ")}
                onChange={(e) => {
                  handleCardInputs(e.target.id, e.target.value.replace(/[^0-9]/g, ""));
                  choseIcon(e.target.value);
                }}
                placeholder="0000 0000 0000 0000"
                size="xl"
                endContent={iconToDisplay}
                validationState={errors.card ? "invalid" : undefined}
                errorMessage={errors?.card}
                autoComplete="cc-number"
              />
            </div>

            <div className="flex gap-2 w-full">
              <div className="flex flex-col gap-1 w-[50%]">
                <p className="text-tr font-normal text-textlightgrey">{t("payment.exp")}</p>
                <DateField
                  id="exp"
                  format="MM/YY"
                  onUpdate={(e) => handleCardInputs("exp", formatDateTime(e))}
                  placeholder="MM/YY"
                  size="xl"
                  validationState={errors.exp ? "invalid" : undefined}
                  errorMessage={errors?.exp}
                />
              </div>

              {isName && (
                <div className="flex flex-col gap-1 w-[50%]">
                  <p className="text-tr font-normal text-textlightgrey">{t("payment.code")}</p>
                  <TextInput
                    id="cvv"
                    controlProps={{ maxLength: 3 }}
                    value={card?.cvv}
                    onChange={(e) => handleCardInputs(e.target.id, e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="000"
                    size="xl"
                    validationState={errors.cvv ? "invalid" : undefined}
                    errorMessage={errors?.cvv}
                    autoComplete="cc-csc"
                  />
                </div>
              )}
            </div>
            {isName ? (
              <div className="flex flex-col gap-1">
                <p className="text-tr font-normal text-textlightgrey">{t("payment.nlm")}</p>
                <TextInput
                  id="name"
                  value={card?.name}
                  onChange={(e) => handleCardInputs(e.target.id, e.target.value)}
                  placeholder=""
                  size="xl"
                  validationState={errors.name ? "invalid" : undefined}
                  errorMessage={errors?.name}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-tr font-normal text-textlightgrey">{t("payment.phone_number")}</p>
                <PhoneInputComp
                  value={card?.phoneNumber}
                  onChange={(e) => setCard((prev) => ({ ...prev, phoneNumber: e }))}
                  error={errors?.phoneNumber}
                />
              </div>
            )}
          </div>

          {errors?.type && <p className="text-errorred text-ft font-normal">{errors.type}</p>}

          <div className="flex w-fit justify-end self-end gap-2">
            <Button
              onClick={() => {
                onClose();
                setCard({
                  name: "",
                  phoneNumber: "",
                  card: "",
                  exp: "",
                  cvv: "",
                  verification: "",
                  type: "",
                });
                setIsName(true);
              }}
              type="button"
              view="normal"
              size="l"
            >
              {t("payment.cancel")}
            </Button>
            <Button type="button" onClick={handleCreation} view="action" size="l">
              {t("payment.add")}
            </Button>
          </div>

          <p className="text-tr font-normal text-center text-icongray">
            {t("log_reg.public")} <br />
            {/* don't forget to change url */}
            <a href="" target="_blank" className="text-linkblue">
              {t("log_reg.sub_pub")}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default AddNewCard;
