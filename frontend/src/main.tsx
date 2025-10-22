import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./normalize.css";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Navigate to="/cameras" replace />
  // },
  // {
  //   path: "/cameras",
  //   element: <Cameras />,
  // },
  // {
  //   path: "/camera/:id",
  //   element: ,
  // },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
