import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppShell, Group, Container, Anchor, Text, Button } from '@mantine/core';

const links = [
  { link: '/', label: 'Home' },
  { link: '/shelters', label: 'Shelters' },
  { link: '/pets', label: 'Pets' },
  { link: '/applications', label: 'Applications' },
  { link: '/about', label: 'About' },
];

function Layout() {
  const [active, setActive] = useState(links[0].link);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    navigate('/');
  };

  const items = links.map((link) => (
    <Anchor
      component={Link}
      to={link.link}
      key={link.label}
      onClick={() => setActive(link.link)}
      c={active === link.link ? 'blue' : 'dimmed'}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Text size="xl" fw={700}>PawMatch</Text>
            <Group gap="xs">
              {items}
              {!isAuthenticated ? (
                <>
                  <Anchor component={Link} to="/login" size="sm">Login</Anchor>
                  <Anchor component={Link} to="/register" size="sm">Register</Anchor>
                </>
              ) : (
                <Button variant="subtle" size="xs" onClick={handleLogout}>Logout</Button>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
