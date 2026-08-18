import { Fragment } from 'react';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { Activity } from '@/api/generated/models/Activity';
import ManagementTable from '@/components/Shared/ManagementTable/ManagementTable';
import ActivityDraggableRow from './ActivityDraggableRow';
import groupActivitiesForDisplay from './groupActivitiesForDisplay';

type Props = {
  activities: Activity[];
  dragDisabled?: boolean;
  onDelete: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onReorder: (updatedActivities: Activity[]) => void;
};

const ACTIVITIES_TABLE_COLUMN_COUNT = 5;

const formatFundingAllocations = (activity: Activity) => {
  return (
    activity.fundingSources
      ?.map((fundingSource) => {
        if (!fundingSource.fundingSourceName) return '';
        if (fundingSource.percentage === undefined) return fundingSource.fundingSourceName;
        return `${fundingSource.fundingSourceName} ${fundingSource.percentage}%`;
      })
      .filter(Boolean)
      ?? []
  );
};

const ActivitiesTable = ({ activities, dragDisabled = false, onDelete, onEdit, onReorder }: Props) => {
  const activityGroups = groupActivitiesForDisplay(activities);

  const groupLabelByActivityId = new Map(
    activityGroups.flatMap((activityGroup) => activityGroup.activities.map((activity) => [activity.activityId as string, activityGroup.groupLabel])),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Reorders activities within whichever single group (or the ungrouped block) the drag stayed inside —
  // a drop into a different group is ignored, since group membership is only changed via the edit dialog.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeGroupLabel = groupLabelByActivityId.get(active.id as string);
    const overGroupLabel = groupLabelByActivityId.get(over.id as string);
    if (activeGroupLabel !== overGroupLabel) return;

    const draggedGroup = activityGroups.find((activityGroup) => activityGroup.groupLabel === activeGroupLabel);
    if (!draggedGroup) return;

    const oldIndex = draggedGroup.activities.findIndex((activity) => activity.activityId === active.id);
    const newIndex = draggedGroup.activities.findIndex((activity) => activity.activityId === over.id);
    const reorderedGroupActivities = arrayMove(draggedGroup.activities, oldIndex, newIndex);

    const sortOrderByActivityId = new Map(reorderedGroupActivities.map((activity, index) => [activity.activityId, index]));

    const updatedActivities = activities.map((activity) => {
      const nextSortOrder = sortOrderByActivityId.get(activity.activityId);
      return nextSortOrder === undefined ? activity : { ...activity, sortOrder: nextSortOrder };
    });

    onReorder(updatedActivities);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <ManagementTable
        headers={[
          { label: '' },
          { label: 'Activity' },
          { label: 'Payroll Category' },
          { label: 'Funding Allocation' },
          { label: 'Actions', align: 'right' },
        ]}
      >
        {activityGroups.map((activityGroup) => (
          <Fragment key={activityGroup.groupLabel ?? 'ungrouped'}>
            {activityGroup.groupLabel && (
              <TableRow key={`group-${activityGroup.groupLabel}`}>
                <TableCell colSpan={ACTIVITIES_TABLE_COLUMN_COUNT} sx={{ backgroundColor: 'action.hover', fontWeight: 'bold' }}>
                  {activityGroup.groupLabel}
                </TableCell>
              </TableRow>
            )}
            <SortableContext items={activityGroup.activities.map((activity) => activity.activityId as string)} strategy={verticalListSortingStrategy}>
              {activityGroup.activities.map((activity) => (
                <ActivityDraggableRow
                  key={activity.activityId}
                  activity={activity}
                  disabled={dragDisabled}
                  formatFundingAllocations={formatFundingAllocations}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </SortableContext>
          </Fragment>
        ))}
      </ManagementTable>
    </DndContext>
  );
};

export default ActivitiesTable;
