import React from "react";
import { Select } from "@gravity-ui/uikit";
import { ReactComponent as RuFlag } from "../img/RU.svg";
import { ReactComponent as EnFlag } from "../img/GB.svg";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [selected, setSelected] = React.useState(i18n.language);

  const handleLanguage = (val: string[]) => {
    Cookies.set("language", `${val[0]}`, { expires: 7 });
    setSelected(val[0]);
    i18n.changeLanguage(val[0]);
  };

  const options = [
    {
      value: "ru",
      label: "Русский",
      flag: <RuFlag />,
    },
    {
      value: "en",
      label: "English",
      flag: <EnFlag />,
    },
  ];

  return (
    <Select
      value={[selected]}
      onUpdate={handleLanguage}
      renderSelectedOption={() => {
        if (selected === "ru") return <RuFlag className="w-6" />;
        return <EnFlag className="w-6" />;
      }}
      popupPlacement={"bottom-start"}
      popupWidth={"outfit" as any}
      className="language p-1 w-[72px] [&>div>button:hover::after]:!bg-transparent bg-white border-0 rounded-3xl flex items-center justify-center align-baseline hover:bg-white"
    >
      {options?.map((option) => {
        return (
          <Select.Option value={option.value} data={{ padding: 4 }} key={option?.label}>
            <div style={{ display: "flex", alignItems: "center" }} className="gap-1">
              {option.flag}
              {option.label}
            </div>
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default LanguageSelector;
