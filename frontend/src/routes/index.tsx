import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";
import RootLayout from "../pages/RootLayout";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";
import RootLayoutSigned from "../pages/RootLayoutSigned";
import CreatedCourses from "../pages/CreatedCourses";
import CourseCreation from "../pages/CourseCreation";
import HomePage from "../pages/HomePage";
import Payment from "../pages/Payment";

const Routes = () => {
  const router = createBrowserRouter([
    // ...routerDisplay(),
    // ...logRegRoutes,
    {
      element: <RootLayoutSigned />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/payment", element: <Payment /> },
        { path: "/uploadedcourses", element: <CreatedCourses /> },
        { path: "/createcourse", element: <CourseCreation /> },
      ],
    },
    {
      element: <RootLayout />,
      children: [
        { path: "/registration", element: <RegistrationPage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
