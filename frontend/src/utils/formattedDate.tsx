import Cookies from "js-cookie";

export const formattedDate = (time: string) => {
  return new Date(time).toLocaleDateString(Cookies.get("language"), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
