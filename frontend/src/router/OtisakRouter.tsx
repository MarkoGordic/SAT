import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

const OtisakRouter: React.FC = () => (
  <RouterProvider router={routes} />
);

export default OtisakRouter;
