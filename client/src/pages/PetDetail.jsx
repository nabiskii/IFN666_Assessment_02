import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Text, Title, Badge, Loader, Alert, Group, Button, SimpleGrid } from '@mantine/core';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const statusColors = { available: 'green', pending: 'yellow', adopted: 'blue' };
const appStatusColors = { pending: 'yellow', approved: 'green', rejected: 'red' };

function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/pets/${id}`);
        if (!response.ok) {
          throw new Error('Pet not found');
        }
        const data = await response.json();
        setPet(data.pet);
        setApplications(data.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;
  if (!pet) return <Alert color="red">Pet not found</Alert>;

  return (
    <>
      <Button variant="subtle" component={Link} to="/pets" mb="md">← Back to Pets</Button>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
        <Group justify="space-between" mb="xs">
          <Title order={2}>{pet.name}</Title>
          <Badge color={statusColors[pet.status]} size="lg">{pet.status}</Badge>
        </Group>
        <Text size="sm" c="dimmed">Species: {pet.species}</Text>
        <Text size="sm" c="dimmed">Breed: {pet.breed}</Text>
        <Text size="sm" c="dimmed">Age: {pet.age}</Text>
        <Text size="sm" c="dimmed">Gender: {pet.gender}</Text>
        {pet.shelter && (
          <Text size="sm" c="dimmed">
            Shelter: <Link to={`/shelters/${pet.shelter._id}`}>{pet.shelter.name}</Link>
          </Text>
        )}
        <Text size="sm" mt="xs">{pet.description}</Text>
      </Card>

      <Title order={3} mb="md">Adoption Applications ({applications.length})</Title>
      {applications.length === 0 ? (
        <Text c="dimmed">No applications for this pet.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {applications.map((app) => (
            <Card shadow="sm" padding="lg" radius="md" withBorder key={app._id}>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Application</Text>
                <Badge color={appStatusColors[app.status]}>{app.status}</Badge>
              </Group>
              <Text size="sm" c="dimmed">Applicant: {app.applicant?.username || 'Unknown'}</Text>
              <Text size="sm" mt="xs">{app.message}</Text>
              <Button variant="outline" size="xs" mt="md" component={Link} to={`/applications/${app._id}`}>View</Button>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}

export default PetDetail;
