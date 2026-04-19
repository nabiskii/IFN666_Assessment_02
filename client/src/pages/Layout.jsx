import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppShell, Group, Container, Anchor, Text, Button, Burger, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../context/AuthContext';

const publicLinks = [
  { link: '/', label: 'Home' },
  { link: '/shelters', label: 'Shelters' },
  { link: '/pets', label: 'Pets' },
  { link: '/about', label: 'About' },
];

function Layout() {
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const authLinks = isAdmin
    ? [{ link: '/applications', label: 'Applications' }]
    : [{ link: '/applications', label: 'My Applications' }];
  const links = isAuthenticated ? [...publicLinks, ...authLinks] : publicLinks;

  const items = links.map((link) => (
    <Anchor
      component={Link}
      to={link.link}
      key={link.label}
      onClick={close}
      c={location.pathname === link.link ? 'blue' : 'dimmed'}
      size="sm"
      fw={location.pathname === link.link ? 600 : 400}
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
            <Anchor component={Link} to="/" underline="never">
              <Text size="xl" fw={800} c="blue">PawMatch</Text>
            </Anchor>
            <Group gap="md" visibleFrom="sm">
              {items}
              {!isAuthenticated ? (
                <Group gap="xs">
                  <Button variant="subtle" size="xs" component={Link} to="/login">Login</Button>
                  <Button size="xs" component={Link} to="/register">Register</Button>
                </Group>
              ) : (
                <Button variant="subtle" size="xs" color="red" onClick={handleLogout}>Logout</Button>
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
            <Button variant="subtle" size="xs" color="red" onClick={handleLogout}>Logout</Button>
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
