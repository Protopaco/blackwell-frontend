import { useRef, useState } from 'react';
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
import { activityApi, payPeriodApi } from '@/api/client';
import useFetchByKey from '@/hooks/useFetchByKey';
import useTextSearch from '@/hooks/useTextSearch';
import { useToast } from '@/state/toast/toast.context';
import focusFirstField from '@/utils/focusFirstField';
import resolveErrorMessage from '@/utils/resolveErrorMessage';
import type { Activity } from '@/api/generated/models/Activity';

type Props = {
  clientId: string;
  payPeriodId: string;
  open: boolean;
  onClose: () => void;
  currentActivityIds: string[];
  onAdded: () => void;
};

const AddExistingActivityDialog = ({ clientId, payPeriodId, open, onClose, currentActivityIds, onAdded }: Props) => {
  const { showToast } = useToast();
  const [addingActivityId, setAddingActivityId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    data: clientActivities,
    errorMessage,
    loading,
  } = useFetchByKey(open ? clientId : undefined, (clientId) => activityApi.v1GetActivities({ clientId }), 'Failed to load activities.');

  const addableActivities = (clientActivities ?? []).filter(
    (activity) => !currentActivityIds.includes(activity.activityId ?? ''),
  );

  const { searchTerm, setSearchTerm, filteredItems: searchedActivities } = useTextSearch(addableActivities, (activity) => [
    activity.activityName ?? '',
  ]);

  const sortedActivities = [...searchedActivities].sort((left, right) =>
    (left.activityName ?? '').localeCompare(right.activityName ?? '', undefined, { sensitivity: 'base' }),
  );

  const handleAdd = async (activityId: string) => {
    setAddingActivityId(activityId);
    try {
      await payPeriodApi.v1AddActivityToPayPeriod({ clientId, payPeriodId, activityId });
      showToast('Activity added to pay period.', 'success');
      onAdded();
    } catch (error) {
      const message = await resolveErrorMessage(error, 'Failed to add activity to pay period.');
      showToast(message, 'error');
    } finally {
      setAddingActivityId(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ transition: { onEntered: () => focusFirstField(contentRef.current) } }}
    >
      <DialogTitle>Add Activity to Pay Period</DialogTitle>
      <DialogContent ref={contentRef}>
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
        ) : sortedActivities.length === 0 ? (
          <Typography color="text.secondary">No activities available to add.</Typography>
        ) : (
          <List dense>
            {sortedActivities.map((activity: Activity) => (
              <ListItem
                key={activity.activityId}
                secondaryAction={
                  addingActivityId === activity.activityId ? (
                    <CircularProgress size={20} />
                  ) : (
                    <IconButton
                      aria-label={`Add ${activity.activityName}`}
                      edge="end"
                      onClick={() => handleAdd(activity.activityId!)}
                      disabled={addingActivityId !== null}
                    >
                      <AddIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText primary={activity.activityName} />
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

export default AddExistingActivityDialog;
