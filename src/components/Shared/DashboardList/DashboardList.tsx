import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type DashboardListItem = {
  key: string;
  labels: string[];
};

type Props = {
  items: DashboardListItem[];
};

const DashboardList = ({ items }: Props) => {
  return (
    <List dense disablePadding>
      {items.map((item) => (
        <ListItem key={item.key} disableGutters>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2">{item.labels[0]}</Typography>
            {item.labels.length > 1 && (
              <Typography variant="body2" color="text.secondary">
                {item.labels.slice(1).join(' · ')}
              </Typography>
            )}
          </Stack>
        </ListItem>
      ))}
    </List>
  );
};

export default DashboardList;
