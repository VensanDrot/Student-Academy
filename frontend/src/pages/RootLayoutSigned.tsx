import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useRefreshToken } from "../hooks/mutations/loginUser";
import { TopMenu } from "../components/TopMenu";
import SideMenu from "../components/SideMenu";

export const ScrollContext = React.createContext<HTMLDivElement | null>(null);

const RootLayoutSigned = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const outletRef = useRef<HTMLDivElement>(null);
  const [scrollableElement, setScrollableElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("access");
    const refreshToken = Cookies.get("refresh");

    if (refreshToken && !accessToken) refreshTokenMutation.mutate({ refreshToken });

    if (!accessToken && location.pathname !== "/registration" && location.pathname !== "/login")
      navigate(`/login?backto=${searchParams.get("backto") || location.pathname}`);
  }, [navigate, location.pathname]);

  useEffect(() => {
    // Update context value once the DOM node is available
    if (outletRef.current) {
      setScrollableElement(outletRef.current);
    }
  }, []);

  const refreshTokenMutation = useRefreshToken({
    onSuccess: (data) => {
      navigate(searchParams.get("backto") || "/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <ScrollContext.Provider value={scrollableElement}>
      <div className="flex flex-col h-screen w-screen bg-primarygrey overflow-hidden">
        {/* Top Menu */}
        <TopMenu />

        {/* Main Content */}
        <div className="flex-1 pl-10 flex min-h-0 w-full relative gap-10 pb-4">
          <div className="w-[250px] h-full overflow-hidden">
            <SideMenu />
          </div>
          <div
            className="!w-[calc(100%-250px)] pr-10 h-full overflow-hidden overflow-y-auto scroll-cont"
            ref={outletRef} // Attach ref here
          >
            <Outlet />
          </div>
        </div>
      </div>
    </ScrollContext.Provider>
  );
};

export default RootLayoutSigned;
