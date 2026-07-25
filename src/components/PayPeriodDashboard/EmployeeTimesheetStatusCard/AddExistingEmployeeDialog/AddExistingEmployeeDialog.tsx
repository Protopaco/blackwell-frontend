import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { employeeApi, payPeriodApi } from '@/api/client';
import { EmployeeStatusEnum } from '@/api/generated/models/Employee';
import useFetchByKey from '@/hooks/useFetchByKey';
import useTextSearch from '@/hooks/useTextSearch';
import { useToast } from '@/state/toast/toast.context';
import resolveErrorMessage from '@/utils/resolveErrorMessage';
import type { Employee } from '@/api/generated/models/Employee';

type Props = {
  clientId: string;
  payPeriodId: string;
  open: boolean;
  onClose: () => void;
  currentEmployeeIds: string[];
  onAdded: () => void;
};

const employeeName = (employee: Employee) => `${employee.lastName ?? ''}, ${employee.firstName ?? ''}`;

const AddExistingEmployeeDialog = ({ clientId, payPeriodId, open, onClose, currentEmployeeIds, onAdded }: Props) => {
  const { showToast } = useToast();
  const [addingEmployeeId, setAddingEmployeeId] = useState<string | null>(null);

  const {
    data: clientEmployees,
    errorMessage,
    loading,
  } = useFetchByKey(open ? clientId : undefined, (clientId) => employeeApi.v1GetEmployees({ clientId }), 'Failed to load employees.');

  const addableEmployees = (clientEmployees ?? []).filter(
    (employee) => employee.status === EmployeeStatusEnum.Active && !currentEmployeeIds.includes(employee.employeeId ?? ''),
  );

  const { searchTerm, setSearchTerm, filteredItems: searchedEmployees } = useTextSearch(addableEmployees, (employee) => [
    employeeName(employee),
  ]);

  const sortedEmployees = [...searchedEmployees].sort((left, right) =>
    employeeName(left).localeCompare(employeeName(right), undefined, { sensitivity: 'base' }),
  );

  const handleAdd = async (employeeId: string) => {
    setAddingEmployeeId(employeeId);
    try {
      await payPeriodApi.v1AddEmployeeToPayPeriod({ clientId, payPeriodId, employeeId });
      showToast('Employee added to pay period.', 'success');
      onAdded();
    } catch (error) {
      const message = await resolveErrorMessage(error, 'Failed to add employee to pay period.');
      showToast(message, 'error');
    } finally {
      setAddingEmployeeId(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Employee to Pay Period</DialogTitle>
      <DialogContent>
        <TextField
          size="small"
          label="Search by name"
          fullWidth
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          sx={{ mb: 2 }}
        />
        {errorMessage ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : loading ? (
          <CircularProgress size={24} />
        ) : sortedEmployees.length === 0 ? (
          <Typography color="text.secondary">No active employees available to add.</Typography>
        ) : (
          <List dense>
            {sortedEmployees.map((employee) => (
              <ListItem
                key={employee.employeeId}
                secondaryAction={
                  addingEmployeeId === employee.employeeId ? (
                    <CircularProgress size={20} />
                  ) : (
                    <IconButton
                      aria-label={`Add ${employeeName(employee)}`}
                      edge="end"
                      onClick={() => handleAdd(employee.employeeId!)}
                      disabled={addingEmployeeId !== null}
                    >
                      <AddIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText primary={employeeName(employee)} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExistingEmployeeDialog;
