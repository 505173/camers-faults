import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./normalize.css";
import Authorization from "./pages/auth/auth";
import Card from "./pages/card/card";
import Check from "./pages/check/check";
import Emul from "./pages/emul/emul";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/cameras" replace />
  },
  {
    path: "/auth",
    element: < Authorization/>,
  },
   {
    path: "/card",
    element: < Card/>,
  },
  {
    path: "/check",
    element: < Check/>,
  },
    {
    path: "/emule",
    element: < Emul/>,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
