import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type DashboardListItem = {
  key: string;
  labels: string[];
  path?: string | null;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
};

type Props = {
  items: DashboardListItem[];
};

const DashboardList = ({ items }: Props) => {
  const navigate = useNavigate();

  return (
    <List dense disablePadding>
      {items.map((item) => {
        const content = (
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" width="100%">
            <Stack direction="row" spacing={1}>
              {item.startAdornment}
              <Typography variant="body2">{item.labels[0]}</Typography>
              {item.labels.length > 1 && (
                <Typography variant="body2" color="text.secondary">
                  {item.labels.slice(1).join(' · ')}
                </Typography>
              )}
            </Stack>
            {item.endAdornment}
          </Stack>
        );

        if (item.path) {
          return (
            <ListItemButton key={item.key} disableGutters onClick={() => navigate(item.path!)}>
              {content}
            </ListItemButton>
          );
        }

        return (
          <ListItem key={item.key} disableGutters>
            {content}
          </ListItem>
        );
      })}
    </List>
  );
};

export default DashboardList;
