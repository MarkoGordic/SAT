import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import StudentLogin from '../pages/StudentLogin';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/student",
    element: <StudentLogin />,
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
