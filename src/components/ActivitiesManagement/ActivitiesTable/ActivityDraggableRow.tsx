import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { Activity } from '@/api/generated/models/Activity';

type Props = {
  activity: Activity;
  disabled: boolean;
  formatFundingAllocations: (activity: Activity) => string[];
  onDelete: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
};

// One draggable row in ActivitiesTable — only the drag-handle icon carries the drag listeners, so
// clicking the Edit/Delete icons elsewhere in the row still works normally while dragging is in progress.
const ActivityDraggableRow = ({ activity, disabled, formatFundingAllocations, onDelete, onEdit }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.activityId as string,
    disabled,
  });

  return (
    <TableRow
      ref={setNodeRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <TableCell sx={{ width: 1, px: 1 }}>
        <IconButton aria-label={`Reorder ${activity.activityName ?? 'activity'}`} disabled={disabled} size="small" {...attributes} {...listeners}>
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
      </TableCell>
      <TableCell>{activity.activityName}</TableCell>
      <TableCell>{activity.payrollCategory}</TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          {formatFundingAllocations(activity).map((fundingAllocation) => (
            <Typography key={fundingAllocation} variant="body2">
              {fundingAllocation}
            </Typography>
          ))}
        </Stack>
      </TableCell>
      <TableCell align="right">
        <IconButton aria-label={`Edit ${activity.activityName ?? 'activity'}`} onClick={() => onEdit(activity)} size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label={`Delete ${activity.activityName ?? 'activity'}`} onClick={() => onDelete(activity)} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default ActivityDraggableRow;
