export type ManagementTableHeader = {
  label: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  sortDirection?: 'asc' | 'desc';
  onSort?: () => void;
};
