import React from "react";
import { Navigate, RouterProvider, createBrowserRouter, useLocation } from "react-router-dom";
import NotFound from "../pages/NotFound";
import RootLayout from "../pages/RootLayout";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";
import RootLayoutSigned from "../pages/RootLayoutSigned";
import CreatedCourses from "../pages/CreatedCourses";
import CourseCreation from "../pages/CourseCreation";
import HomePage from "../pages/HomePage";
import Payment from "../pages/Payment";
import MyCourses from "../pages/MyCourses";
import CourseDetailsCl from "../pages/CourseDetails";
import TakeLesson from "../pages/TakeLesson";
import CelebrationPage from "../pages/CelebrationPage";
import CoursePreview from "../pages/CoursePreview";
import Cookies from "js-cookie";

const ProtectedRoute = ({ isAllowed, children }: { isAllowed?: string; children: React.ReactNode }) => {
  const access = !!Cookies.get("access");
  const location = useLocation();

  if (!access) {
    return <Navigate to={`/login?backto=${location?.pathname}`} replace />;
  }

  if (isAllowed && Cookies.get(isAllowed) !== "allowed") {
    return <Navigate to={"/notfound"} replace />;
  }

  return <>{children}</>;
};

const Routes = () => {
  const router = createBrowserRouter([
    {
      element: <RootLayoutSigned />,
      children: [
        { path: "/", element: <ProtectedRoute children={<HomePage />} /> },
        { path: "/payment", element: <ProtectedRoute children={<Payment />} /> },
        { path: "/mycourses", element: <ProtectedRoute children={<MyCourses />} /> },
        { path: "/takelesson", element: <ProtectedRoute children={<TakeLesson />} /> },
        { path: "/createcourse", element: <ProtectedRoute children={<CourseCreation />} /> },
        { path: "/coursepreview", element: <ProtectedRoute children={<CoursePreview />} /> },
        { path: "/coursedetails", element: <ProtectedRoute children={<CourseDetailsCl />} /> },
        { path: "/completedtest", element: <ProtectedRoute children={<CelebrationPage />} /> },
        { path: "/uploadedcourses", element: <ProtectedRoute children={<CreatedCourses />} /> },
      ],
    },
    {
      element: <RootLayout />,
      children: [
        { path: "/registration", element: <RegistrationPage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/verify/:token", element: <LoginPage /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
