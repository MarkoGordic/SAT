import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const SATRouter: React.FC = () => (
  <RouterProvider router={routes} />
);

export default SATRouter;
