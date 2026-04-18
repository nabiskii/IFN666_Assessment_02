import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppShell, Group, Container, Anchor, Text, Button, Burger, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const links = [
  { link: '/', label: 'Home' },
  { link: '/shelters', label: 'Shelters' },
  { link: '/pets', label: 'Pets' },
  { link: '/applications', label: 'Applications' },
  { link: '/about', label: 'About' },
];

function Layout() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    close();
    navigate('/');
  };

  const items = links.map((link) => (
    <Anchor
      component={Link}
      to={link.link}
      key={link.label}
      onClick={close}
      c={location.pathname === link.link ? 'blue' : 'dimmed'}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Text size="xl" fw={700}>PawMatch</Text>
            <Group gap="xs" visibleFrom="sm">
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
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="sm">
          {items}
          {!isAuthenticated ? (
            <>
              <Anchor component={Link} to="/login" size="sm" onClick={close}>Login</Anchor>
              <Anchor component={Link} to="/register" size="sm" onClick={close}>Register</Anchor>
            </>
          ) : (
            <Button variant="subtle" size="xs" onClick={handleLogout}>Logout</Button>
          )}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
