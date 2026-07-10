import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Landing = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4">Welcome</Typography>
      <Typography variant="body1">Select a client above to get started.</Typography>
    </Container>
  );
};

export default Landing;
