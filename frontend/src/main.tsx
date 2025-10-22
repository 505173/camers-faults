import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./normalize.css";
import Authorization from "./pages/auth/auth";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/cameras" replace />
  },
  {
    path: "/auth",
    element: < Authorization/>,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
