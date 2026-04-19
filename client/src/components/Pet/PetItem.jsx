import { Link } from 'react-router-dom';
import { Card, Text, Badge, Group, Button, Stack } from '@mantine/core';

const statusColors = {
  available: 'green',
  pending: 'yellow',
  adopted: 'blue',
};

const speciesIcons = {
  dog: '\u{1F436}',
  cat: '\u{1F431}',
  bird: '\u{1F426}',
  rabbit: '\u{1F430}',
  other: '\u{1F43E}',
};

function PetItem({ pet, onEdit, onDelete, onApply }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text ta="center" size="3rem" mb="xs">
        {speciesIcons[pet.species] || speciesIcons.other}
      </Text>
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="lg">{pet.name}</Text>
        <Badge color={statusColors[pet.status]}>{pet.status}</Badge>
      </Group>
      <Stack gap={4}>
        <Text size="sm" c="dimmed">{pet.species}, {pet.breed}</Text>
        <Text size="sm" c="dimmed">{pet.age} years old, {pet.gender}</Text>
        <Text size="sm" c="dimmed">{pet.shelter?.name || 'Unknown shelter'}</Text>
      </Stack>
      <Text size="sm" mt="sm" lineClamp={2}>{pet.description}</Text>
      <Group mt="md">
        <Button variant="outline" size="xs" component={Link} to={`/pets/${pet._id}`}>View</Button>
        {onApply && pet.status === 'available' && (
          <Button size="xs" color="teal" onClick={() => onApply(pet)}>Apply to Adopt</Button>
        )}
        {onEdit && <Button variant="outline" size="xs" onClick={() => onEdit(pet)}>Edit</Button>}
        {onDelete && <Button variant="outline" size="xs" color="red" onClick={() => onDelete(pet)}>Delete</Button>}
      </Group>
    </Card>
  );
}

export default PetItem;
