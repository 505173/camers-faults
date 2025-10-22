import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./normalize.css";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/cameras" replace />
  },
  {
    path: "/cameras",
    element: <App />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
