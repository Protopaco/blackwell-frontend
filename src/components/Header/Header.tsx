import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ClientSelector from "@/components/Header/ClientSelector/ClientSelector";
import SignInButton from "@/components/Header/SignInButton/SignInButton";
import "@/components/Header/Header.css";

const Header = () => {
  return (
    <AppBar position="static" id="header">
      <Toolbar>
        <ClientSelector />
        <SignInButton />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
