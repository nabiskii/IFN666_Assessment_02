import { Link } from 'react-router-dom';
import { Card, Text, Badge, Group, Button, Stack } from '@mantine/core';

const statusColors = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
};

function ApplicationItem({ application, onEdit, onDelete, onApprove, onReject, isAdmin }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="lg">{application.pet?.name || 'Unknown Pet'}</Text>
        <Badge color={statusColors[application.status]}>{application.status}</Badge>
      </Group>
      <Stack gap={4}>
        <Text size="sm" c="dimmed">Species: {application.pet?.species || 'Unknown'}</Text>
        {isAdmin && <Text size="sm" c="dimmed">Applicant: {application.applicant?.username || 'Unknown'}</Text>}
      </Stack>
      <Text size="sm" mt="sm" lineClamp={3}>{application.message}</Text>
      <Group mt="md">
        <Button variant="outline" size="xs" component={Link} to={`/applications/${application._id}`}>View</Button>
        {onApprove && application.status === 'pending' && (
          <Button size="xs" color="green" onClick={() => onApprove(application)}>Approve</Button>
        )}
        {onReject && application.status === 'pending' && (
          <Button size="xs" color="red" variant="outline" onClick={() => onReject(application)}>Reject</Button>
        )}
        {onDelete && <Button variant="outline" size="xs" color="red" onClick={() => onDelete(application)}>Delete</Button>}
      </Group>
    </Card>
  );
}

export default ApplicationItem;
