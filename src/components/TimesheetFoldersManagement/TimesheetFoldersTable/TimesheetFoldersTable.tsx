import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import type { TimesheetFolder } from '@/api/generated/models/TimesheetFolder';

type Props = {
  timesheetFolders: TimesheetFolder[];
  onEdit: (timesheetFolder: TimesheetFolder) => void;
};

const TimesheetFoldersTable = ({ timesheetFolders, onEdit }: Props) => {
  return (
    <ManagementTable
      headers={[
        { label: 'Name' },
        { label: 'Status' },
        { label: 'Actions', align: 'right' },
      ]}
    >
      {timesheetFolders.map((timesheetFolder) => (
        <TableRow key={timesheetFolder.timesheetFolderId ?? timesheetFolder.timesheetFolderName ?? ''}>
          <TableCell>{timesheetFolder.timesheetFolderName}</TableCell>
          <TableCell>{timesheetFolder.status}</TableCell>
          <TableCell align="right">
            <IconButton aria-label={`Edit ${timesheetFolder.timesheetFolderName ?? 'timesheet folder'}`} onClick={() => onEdit(timesheetFolder)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            {timesheetFolder.driveFolderId ? (
              <IconButton
                aria-label={`Open ${timesheetFolder.timesheetFolderName ?? 'timesheet'} Drive folder`}
                component="a"
                href={`https://drive.google.com/drive/folders/${timesheetFolder.driveFolderId}`}
                rel="noreferrer"
                target="_blank"
                size="small"
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            ) : null}
          </TableCell>
        </TableRow>
      ))}
    </ManagementTable>
  );
};

export default TimesheetFoldersTable;
