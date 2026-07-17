import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ClientManagementPage from '@/components/Shared/ClientManagementPage/ClientManagementPage';

const TimesheetFoldersManagement = () => {
  return (
    <ClientManagementPage title="Timesheet Folders">
      <Paper sx={{ p: 3 }} variant="outlined">
        <Typography color="text.secondary">Timesheet folder management will be added here.</Typography>
      </Paper>
    </ClientManagementPage>
  );
};

export default TimesheetFoldersManagement;
