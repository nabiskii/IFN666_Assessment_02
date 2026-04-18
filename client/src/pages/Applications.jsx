import { useState, useEffect } from 'react';
import { Button, Loader, Alert, Title, TextInput, Select, Group, Pagination } from '@mantine/core';
import ApplicationList from '../components/Application/ApplicationList';
import ApplicationForm from '../components/Application/ApplicationForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Applications() {
  const [applications, setApplications] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('status');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isAuthenticated = !!localStorage.getItem('jwt');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10, sort });
      if (search) params.append('search', search);
      const [appsRes, petsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/applications?${params}`),
        fetch(`${API_BASE_URL}/pets`),
      ]);
      const appsData = await appsRes.json();
      const petsData = await petsRes.json();
      setApplications(appsData);
      setPets(petsData);

      const linkHeader = appsRes.headers.get('Link');
      if (linkHeader) {
        const links = {};
        linkHeader.split(',').forEach(link => {
          const match = link.match(/<([^>]+)>; rel="([^"]+)"/);
          if (match) { links[match[2]] = match[1]; }
        });
        if (links.last) {
          const lastUrl = new URL(links.last, window.location.origin);
          setTotalPages(parseInt(lastUrl.searchParams.get('page')) || 1);
        }
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, sort]);

  const handleSearch = () => {
    setPage(1);
    fetchApplications();
  };

  const handleCreate = async (appData) => {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(appData),
    });
    if (response.ok) {
      setModalOpened(false);
      fetchApplications();
    }
  };

  const handleUpdate = async (appData) => {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`${API_BASE_URL}/applications/${selectedApplication._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(appData),
    });
    if (response.ok) {
      setModalOpened(false);
      fetchApplications();
    }
  };

  const handleDelete = async (application) => {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`${API_BASE_URL}/applications/${application._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.ok) fetchApplications();
  };

  const openCreateModal = () => {
    setIsUpdateMode(false);
    setSelectedApplication(null);
    setModalOpened(true);
  };

  const openUpdateModal = (application) => {
    setIsUpdateMode(true);
    setSelectedApplication(application);
    setModalOpened(true);
  };

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <>
      <Title order={2} mb="md">Adoption Applications</Title>
      <Group mb="md" grow preventGrowOverflow={false} wrap="wrap">
        <TextInput
          placeholder="Search by status (pending, approved, rejected)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1, minWidth: 200 }}
        />
        <Select
          value={sort}
          onChange={setSort}
          data={[
            { value: 'status', label: 'Status (A-Z)' },
            { value: '-status', label: 'Status (Z-A)' },
          ]}
          style={{ minWidth: 150 }}
        />
        <Button onClick={handleSearch} style={{ minWidth: 100 }}>Search</Button>
      </Group>
      {isAuthenticated && <Button onClick={openCreateModal} mb="md">New Application</Button>}
      <ApplicationList
        applications={applications}
        onEdit={isAuthenticated ? openUpdateModal : null}
        onDelete={isAuthenticated ? handleDelete : null}
      />
      {totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination value={page} onChange={setPage} total={totalPages} />
        </Group>
      )}
      <ApplicationForm
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        isUpdateMode={isUpdateMode}
        selectedApplication={selectedApplication}
        pets={pets}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </>
  );
}

export default Applications;
