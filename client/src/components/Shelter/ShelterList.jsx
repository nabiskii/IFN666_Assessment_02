import { Link } from 'react-router-dom';
import { SimpleGrid, Card, Text, Group, Button } from '@mantine/core';

function ShelterList({ shelters, onEdit, onDelete }) {
  if (shelters.length === 0) return <Text>No shelters found.</Text>;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
      {shelters.map((shelter) => (
        <Card shadow="sm" padding="lg" radius="md" withBorder key={shelter._id}>
          <Text fw={500} size="lg">{shelter.name}</Text>
          <Text size="sm" c="dimmed">{shelter.address}</Text>
          <Text size="sm" c="dimmed">{shelter.phone}</Text>
          <Text size="sm" c="dimmed">{shelter.email}</Text>
          {shelter.description && <Text size="sm" mt="xs">{shelter.description}</Text>}
          <Group mt="md">
            <Button variant="outline" size="xs" component={Link} to={`/shelters/${shelter._id}`}>View</Button>
            {onEdit && <Button variant="outline" size="xs" onClick={() => onEdit(shelter)}>Edit</Button>}
            {onDelete && <Button variant="outline" size="xs" color="red" onClick={() => onDelete(shelter)}>Delete</Button>}
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default ShelterList;
