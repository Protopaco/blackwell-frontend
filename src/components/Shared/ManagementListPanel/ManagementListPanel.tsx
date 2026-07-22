import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  children: ReactNode;
  controls?: ReactNode;
  empty: boolean;
  emptyMessage: string;
  errorMessage: string | null;
  loading: boolean;
};

const ManagementListPanel = ({ children, controls, empty, emptyMessage, errorMessage, loading }: Props) => {
  return (
    <Paper sx={{ p: 3 }} variant="outlined">
      <Stack spacing={2}>
        {controls}
        {errorMessage ? <Typography color="error">{errorMessage}</Typography> : null}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : null}
        {!loading && !errorMessage && empty ? <Typography color="text.secondary">{emptyMessage}</Typography> : null}
        {!loading && !errorMessage && !empty ? children : null}
      </Stack>
    </Paper>
  );
};

export default ManagementListPanel;
