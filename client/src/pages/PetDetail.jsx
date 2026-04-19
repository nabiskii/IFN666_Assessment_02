import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Text, Title, Badge, Loader, Alert, Group, Button, SimpleGrid, Stack } from '@mantine/core';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const statusColors = { available: 'green', pending: 'yellow', adopted: 'blue' };
const appStatusColors = { pending: 'yellow', approved: 'green', rejected: 'red' };

const speciesIcons = {
  dog: '\u{1F436}',
  cat: '\u{1F431}',
  bird: '\u{1F426}',
  rabbit: '\u{1F430}',
  other: '\u{1F43E}',
};

function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('jwt');
  const isAdmin = (() => {
    if (!token) return false;
    try {
      return JSON.parse(atob(token.split('.')[1])).is_admin;
    } catch { return false; }
  })();

  const fetchPet = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets/${id}`);
      if (!response.ok) {
        throw new Error('Pet not found');
      }
      const data = await response.json();
      setPet(data.pet);

      if (isAdmin) {
        setApplications(data.applications);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
  }, [id]);

  const handleStatusChange = async (application, newStatus) => {
    const response = await fetch(`${API_BASE_URL}/applications/${application._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        applicant: application.applicant?._id || application.applicant,
        pet: application.pet || id,
        status: newStatus,
        message: application.message,
      }),
    });
    if (response.ok) fetchPet();
  };

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;
  if (!pet) return <Alert color="red">Pet not found</Alert>;

  return (
    <>
      <Button variant="subtle" component={Link} to="/pets" mb="md">&larr; Back to Pets</Button>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
        <Text ta="center" size="4rem" mb="xs">
          {speciesIcons[pet.species] || speciesIcons.other}
        </Text>
        <Group justify="space-between" mb="xs">
          <Title order={2}>{pet.name}</Title>
          <Badge color={statusColors[pet.status]} size="lg">{pet.status}</Badge>
        </Group>
        <Stack gap={4}>
          <Text size="sm" c="dimmed">{pet.species}, {pet.breed}</Text>
          <Text size="sm" c="dimmed">{pet.age} years old, {pet.gender}</Text>
          {pet.shelter && (
            <Text size="sm" c="dimmed">
              <Link to={`/shelters/${pet.shelter._id}`}>{pet.shelter.name}</Link>
            </Text>
          )}
        </Stack>
        <Text size="sm" mt="sm">{pet.description}</Text>
      </Card>

      {isAdmin && (
        <>
          <Title order={3} mb="md">Adoption Applications ({applications.length})</Title>
          {applications.length === 0 ? (
            <Text c="dimmed">No applications for this pet.</Text>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {applications.map((app) => (
                <Card shadow="sm" padding="lg" radius="md" withBorder key={app._id}>
                  <Group justify="space-between" mb="xs">
                    <Text fw={500}>{app.applicant?.username || 'Unknown'}</Text>
                    <Badge color={appStatusColors[app.status]}>{app.status}</Badge>
                  </Group>
                  <Text size="sm" mt="xs" lineClamp={3}>{app.message}</Text>
                  <Group mt="md">
                    {app.status === 'pending' && (
                      <>
                        <Button size="xs" color="green" onClick={() => handleStatusChange(app, 'approved')}>Approve</Button>
                        <Button size="xs" color="red" variant="outline" onClick={() => handleStatusChange(app, 'rejected')}>Reject</Button>
                      </>
                    )}
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </>
      )}
    </>
  );
}

export default PetDetail;
