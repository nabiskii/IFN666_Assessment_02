import { Card, Text, Badge, Group, Button } from '@mantine/core';

const statusColors = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
};

function ApplicationItem({ application, onEdit, onDelete }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="lg">Application</Text>
        <Badge color={statusColors[application.status]}>{application.status}</Badge>
      </Group>
      <Text size="sm" c="dimmed">Pet: {application.pet?.name || 'Unknown'}</Text>
      <Text size="sm" c="dimmed">Applicant: {application.applicant?.username || 'Unknown'}</Text>
      <Text size="sm" mt="xs">{application.message}</Text>
      <Group mt="md">
        <Button variant="outline" size="xs" onClick={() => onEdit(application)}>Edit</Button>
        <Button variant="outline" size="xs" color="red" onClick={() => onDelete(application)}>Delete</Button>
      </Group>
    </Card>
  );
}

export default ApplicationItem;
