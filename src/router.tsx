import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/AppLayout";
import Landing from "@/pages/Landing";
import ClientSummary from "@/pages/ClientSummary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "client/:clientId", element: <ClientSummary /> },
    ],
  },
]);

export default router;
