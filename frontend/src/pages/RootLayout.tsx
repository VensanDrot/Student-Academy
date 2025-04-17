import Cookies from "js-cookie";
import React, { useEffect } from "react";
// import { TopMenu } from "../components/TopMenu";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { TopMenu } from "../components/TopMenu";
import { useRefreshToken } from "../hooks/mutations/login-user";

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = Cookies.get("access");
    const refreshToken = Cookies.get("refresh");

    if (refreshToken && !accessToken) refreshTokenMutation.mutate({ refreshToken });
  }, [navigate, location.pathname]);

  const refreshTokenMutation = useRefreshToken({
    onSuccess: (data) => {
      navigate(searchParams.get("backto") || "/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-primarygrey">
      {/* Top Menu */}
      <TopMenu />

      {/* Main Content */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <div className="w-full h-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
