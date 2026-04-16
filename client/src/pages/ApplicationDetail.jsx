import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Text, Title, Badge, Loader, Alert, Group, Button } from '@mantine/core';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const statusColors = { pending: 'yellow', approved: 'green', rejected: 'red' };

function ApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/applications/${id}`);
        if (!response.ok) {
          throw new Error('Application not found');
        }
        const data = await response.json();
        setApplication(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;
  if (!application) return <Alert color="red">Application not found</Alert>;

  return (
    <>
      <Button variant="subtle" component={Link} to="/applications" mb="md">← Back to Applications</Button>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Title order={2}>Adoption Application</Title>
          <Badge color={statusColors[application.status]} size="lg">{application.status}</Badge>
        </Group>
        <Text size="sm" c="dimmed">Applicant: {application.applicant?.username || 'Unknown'}</Text>
        {application.pet && (
          <Text size="sm" c="dimmed">
            Pet: <Link to={`/pets/${application.pet._id}`}>{application.pet.name}</Link>
            {' '}({application.pet.species})
          </Text>
        )}
        <Title order={4} mt="md" mb="xs">Message</Title>
        <Text size="sm">{application.message}</Text>
      </Card>
    </>
  );
}

export default ApplicationDetail;
