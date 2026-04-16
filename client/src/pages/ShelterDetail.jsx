import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Text, Title, Badge, Loader, Alert, Group, Button, SimpleGrid } from '@mantine/core';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ShelterDetail() {
  const { id } = useParams();
  const [shelter, setShelter] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShelter = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/shelters/${id}`);
        if (!response.ok) {
          throw new Error('Shelter not found');
        }
        const data = await response.json();
        setShelter(data.shelter);
        setPets(data.pets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShelter();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;
  if (!shelter) return <Alert color="red">Shelter not found</Alert>;

  const statusColors = { available: 'green', pending: 'yellow', adopted: 'blue' };

  return (
    <>
      <Button variant="subtle" component={Link} to="/shelters" mb="md">← Back to Shelters</Button>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
        <Title order={2} mb="xs">{shelter.name}</Title>
        <Text size="sm" c="dimmed">Address: {shelter.address}</Text>
        <Text size="sm" c="dimmed">Phone: {shelter.phone}</Text>
        <Text size="sm" c="dimmed">Email: {shelter.email}</Text>
        {shelter.description && <Text size="sm" mt="xs">{shelter.description}</Text>}
      </Card>

      <Title order={3} mb="md">Pets at this Shelter ({pets.length})</Title>
      {pets.length === 0 ? (
        <Text c="dimmed">No pets at this shelter.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {pets.map((pet) => (
            <Card shadow="sm" padding="lg" radius="md" withBorder key={pet._id}>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>{pet.name}</Text>
                <Badge color={statusColors[pet.status]}>{pet.status}</Badge>
              </Group>
              <Text size="sm" c="dimmed">{pet.species} - {pet.breed}</Text>
              <Text size="sm" c="dimmed">Age: {pet.age} | Gender: {pet.gender}</Text>
              <Button variant="outline" size="xs" mt="md" component={Link} to={`/pets/${pet._id}`}>View</Button>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}

export default ShelterDetail;
