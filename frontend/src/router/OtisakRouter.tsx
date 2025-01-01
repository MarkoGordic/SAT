import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>Otisak</h1>,
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
