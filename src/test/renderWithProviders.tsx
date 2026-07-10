import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { StrictMode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import ClientProvider from "@/state/client/client.provider";

const renderWithProviders = (ui: ReactElement) => {
  return render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ClientProvider>{ui}</ClientProvider>
      </ThemeProvider>
    </StrictMode>,
  );
};

export default renderWithProviders;
