import { ReactComponent as GradCap } from "../img/graduation-cap.svg";
import { ReactComponent as Clock } from "../img/clock.svg";
import { ReactComponent as ExamStar } from "../img/starcheck.svg";
import { ReactComponent as Employee } from "../img/employees.svg";
import { ReactComponent as Subscription } from "../img/sub.svg";
import { ReactComponent as Settings } from "../img/settings.svg";
import { ReactComponent as Categories } from "../img/categories.svg";
import { ReactComponent as Clients } from "../img/employee.svg";
import { ReactComponent as Analytics } from "../img/analytics.svg";
import Cookies from "js-cookie";

export const SideMenuLinks = [
  {
    link: "/",
    text: "side_menu.courses",
    icon: <GradCap />,
    render: () => Cookies.get("courses") === "allowed",
  },
  // {
  //   link: "/activecourses",
  //   text: "side_menu.active_courses",
  //   icon: <Clock />,
  //   render: () => Cookies.get("active_courses") === "allowed",
  // },
  {
    link: "/uploadedcourses",
    text: "side_menu.exams",
    icon: <ExamStar />,
    render: () => Cookies.get("exams") === "allowed",
  },
  // {
  //   link: "/employees",
  //   text: "side_menu.employees",
  //   icon: <Employee />,
  //   render: () => Cookies.get("users") === "allowed",
  // },
  // {
  //   link: "/analytics",
  //   text: "side_menu.analytics",
  //   icon: <Analytics />,
  //   render: () => Cookies.get("analytics") === "allowed",
  // },
  // {
  //   link: "/subscription",
  //   text: "side_menu.sub",
  //   icon: <Subscription />,
  //   render: () => Cookies.get("subscriptions") === "allowed",
  // },
  // {
  //   link: "/settings",
  //   text: "side_menu.settings",
  //   icon: <Settings />,
  //   render: () => Cookies.get("profile") === "allowed",
  // },
];

export const removeCookies = ["access", "name", "lastname", "refresh", "email"];
