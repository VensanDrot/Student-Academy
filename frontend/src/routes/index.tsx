import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";
import RootLayout from "../pages/RootLayout";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";

const Routes = () => {
  const router = createBrowserRouter([
    // ...routerDisplay(),
    // ...logRegRoutes,
    {
      element: <RootLayout />,
      children: [{ path: "/registration", element: <RegistrationPage /> }],
    },
    {
      element: <RootLayout />,
      children: [{ path: "/login", element: <LoginPage /> }],
    },
    {
      element: <RootLayout />,
      children: [{ path: "*", element: <NotFound /> }],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
