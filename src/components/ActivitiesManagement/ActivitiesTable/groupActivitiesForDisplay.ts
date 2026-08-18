import type { Activity } from '@/api/generated/models/Activity';

export type ActivityDisplayGroup = {
  groupLabel: string | null;
  activities: Activity[];
};

// Orders activities the same way the generated timesheet does (see the backend's groupActivities):
// ungrouped activities first by their own sortOrder, then named groups alphabetically by groupLabel,
// each group's activities ordered by their own sortOrder. The ungrouped entry is omitted when empty.
const groupActivitiesForDisplay = (activities: Activity[]): ActivityDisplayGroup[] => {
  const bySortOrder = (left: Activity, right: Activity) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0);

  const ungroupedActivities = activities
    .filter((activity) => !activity.groupLabel)
    .sort(bySortOrder);

  const groupedActivitiesByLabel = new Map<string, Activity[]>();
  activities
    .filter((activity) => activity.groupLabel)
    .forEach((activity) => {
      const groupLabel = activity.groupLabel as string;
      const existingGroup = groupedActivitiesByLabel.get(groupLabel) ?? [];
      existingGroup.push(activity);
      groupedActivitiesByLabel.set(groupLabel, existingGroup);
    });

  const namedGroups: ActivityDisplayGroup[] = [...groupedActivitiesByLabel.entries()]
    .sort(([firstGroupLabel], [secondGroupLabel]) => firstGroupLabel.localeCompare(secondGroupLabel, undefined, { sensitivity: 'base' }))
    .map(([groupLabel, groupActivities]) => ({
      groupLabel,
      activities: groupActivities.sort(bySortOrder),
    }));

  return ungroupedActivities.length > 0
    ? [{ groupLabel: null, activities: ungroupedActivities }, ...namedGroups]
    : namedGroups;
};

export default groupActivitiesForDisplay;
