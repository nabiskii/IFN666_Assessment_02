import { Card, Text, Badge, Group, Button } from '@mantine/core';

const statusColors = {
  available: 'green',
  pending: 'yellow',
  adopted: 'blue',
};

function PetItem({ pet, onEdit, onDelete }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="lg">{pet.name}</Text>
        <Badge color={statusColors[pet.status]}>{pet.status}</Badge>
      </Group>
      <Text size="sm" c="dimmed">{pet.species} - {pet.breed}</Text>
      <Text size="sm" c="dimmed">Age: {pet.age} | Gender: {pet.gender}</Text>
      <Text size="sm" c="dimmed">Shelter: {pet.shelter?.name || 'Unknown'}</Text>
      <Text size="sm" mt="xs">{pet.description}</Text>
      <Group mt="md">
        <Button variant="outline" size="xs" onClick={() => onEdit(pet)}>Edit</Button>
        <Button variant="outline" size="xs" color="red" onClick={() => onDelete(pet)}>Delete</Button>
      </Group>
    </Card>
  );
}

export default PetItem;
