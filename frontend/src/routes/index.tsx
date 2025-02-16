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
import MyCourses from "../pages/MyCourses";
import CourseDetailsCl from "../pages/CourseDetails";
import TakeLesson from "../pages/TakeLesson";
import CelebrationPage from "../pages/CelebrationPage";
import CoursePreview from "../pages/CoursePreview";

const Routes = () => {
  const router = createBrowserRouter([
    // ...routerDisplay(),
    // ...logRegRoutes,
    {
      element: <RootLayoutSigned />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/payment", element: <Payment /> },
        { path: "/mycourses", element: <MyCourses /> },
        { path: "/takelesson", element: <TakeLesson /> },
        { path: "/createcourse", element: <CourseCreation /> },
        { path: "/coursepreview", element: <CoursePreview /> },
        { path: "/coursedetails", element: <CourseDetailsCl /> },
        { path: "/completedtest", element: <CelebrationPage /> },
        { path: "/uploadedcourses", element: <CreatedCourses /> },
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
