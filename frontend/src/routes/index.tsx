import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";
import RootLayout from "../pages/RootLayout";

const Routes = () => {
  const router = createBrowserRouter([
    // ...routerDisplay(),
    // ...logRegRoutes,
    {
      element: <RootLayout />,
      children: [{ path: "*", element: <NotFound /> }],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
