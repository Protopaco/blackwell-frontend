import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import "@/components/Header/Header.css";

const Header = () => {
  return (
    <AppBar position="static" id="header">
      <Toolbar />
    </AppBar>
  );
};

export default Header;
