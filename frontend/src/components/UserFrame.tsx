import { FC } from "react";
import { Avatar, DropdownMenu } from "@gravity-ui/uikit";
import Cookies from "js-cookie";
import { ReactComponent as Arrow } from "../img/toright.svg";
import { ReactComponent as Exit } from "../img/exit.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { removeCookies } from "../constants/sideMenuLinks";

interface IProps {
  url?: string;
  name?: string;
}

const UserFrame: FC<IProps> = ({ url, name }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-1 bg-white !h-9 relative rounded-3xl flex items-center">
      <Avatar
        imgUrl={url}
        size="m" // Medium size avatar
        alt="User Avatar"
        className="mr-2"
      />

      <span className="text-black font-semibold">{name || "Имя Пользователя"}</span>

      <DropdownMenu
        popupProps={{ className: "w-[130px] left-0 !top-2" }}
        renderSwitcher={(props) => (
          <div {...props} className="w-[20px] ml-2" style={{ cursor: "pointer" }}>
            <Arrow className="rotate-90 w-3 fill-black" />
          </div>
        )}
        items={[
          {
            iconStart: <Exit className="fill-errorred" />,
            action: () => {
              removeCookies.forEach((cookie) => {
                Cookies.remove(cookie);
              });
              navigate("/login");
            },
            text: t("log_reg.exit"),
            theme: "danger",
          },
        ]}
      />
    </div>
  );
};

export default UserFrame;
