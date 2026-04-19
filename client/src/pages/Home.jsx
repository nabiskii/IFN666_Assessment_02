import { Link } from 'react-router-dom';
import { Title, Text, Button, SimpleGrid, Card, Group, ThemeIcon } from '@mantine/core';

function Home() {
  const isAuthenticated = !!localStorage.getItem('jwt');

  return (
    <>
      <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
        <Title order={1} size="2.5rem" mb="md">Find Your Perfect Companion</Title>
        <Text size="lg" c="dimmed" maw={600} mx="auto" mb="xl">
          PawMatch connects loving families with pets in need of a home.
          Browse shelters, meet animals, and start your adoption journey today.
        </Text>
        <Group justify="center" gap="md">
          <Button size="lg" component={Link} to="/pets">Browse Pets</Button>
          <Button size="lg" variant="outline" component={Link} to="/shelters">View Shelters</Button>
        </Group>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt="xl">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <ThemeIcon size="xl" radius="md" variant="light" color="blue" mb="md">
            <Text size="xl">&#x1F3E0;</Text>
          </ThemeIcon>
          <Text fw={600} size="lg" mb="xs">Browse Shelters</Text>
          <Text size="sm" c="dimmed">
            Explore local shelters and rescue organizations caring for animals in your area.
          </Text>
        </Card>

        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <ThemeIcon size="xl" radius="md" variant="light" color="teal" mb="md">
            <Text size="xl">&#x1F43E;</Text>
          </ThemeIcon>
          <Text fw={600} size="lg" mb="xs">Meet Pets</Text>
          <Text size="sm" c="dimmed">
            Dogs, cats, birds, rabbits and more. Find the perfect pet waiting for a loving home.
          </Text>
        </Card>

        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <ThemeIcon size="xl" radius="md" variant="light" color="orange" mb="md">
            <Text size="xl">&#x1F4DD;</Text>
          </ThemeIcon>
          <Text fw={600} size="lg" mb="xs">Apply to Adopt</Text>
          <Text size="sm" c="dimmed">
            {isAuthenticated
              ? 'Submit an adoption application and give a pet their forever home.'
              : 'Create an account to submit adoption applications.'}
          </Text>
        </Card>
      </SimpleGrid>
    </>
  );
}

export default Home;
