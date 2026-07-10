import { Routes, Route, Navigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import Header from "@/components/Header/Header";

const Home = () => (
  <Container sx={{ py: 4 }}>
    <Typography variant="h4">Home</Typography>
  </Container>
);

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
