import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "@/components/Header/Header";
import Landing from "@/pages/Landing";
import { useClient } from "@/state/client/client.context";
import "@/AppLayout.css";

const AppLayout = () => {
  const { state } = useClient();

  return (
    <>
      <Header />
      <Box component="main" id="main">
        {state.selectedClient ? <Outlet /> : <Landing />}
      </Box>
    </>
  );
};

export default AppLayout;
