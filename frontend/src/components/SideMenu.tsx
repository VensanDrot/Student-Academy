import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SideMenuLinks } from "../constants/sideMenuLinks";

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { pathname } = location;
  const activeClass = "!bg-white !text-black [&>svg]:!fill-iconorange";

  return (
    <div className="h-full w-full flex flex-col gap-2">
      {SideMenuLinks.map((link: any) => (
        <button
          key={link.text}
          type="button"
          onClick={() => navigate(link.link)}
          className={`flex gap-2 items-center px-4 h-[47px] text-st font-semibold text-left rounded-xl w-full text-[#00000080] [&>svg]:fill-[#00000080] [&>svg]:w-[22px] [&>svg]:h-[22px] ${
            pathname === link.link && activeClass
          }`}
        >
          {link.icon}
          {t(link.text)}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
