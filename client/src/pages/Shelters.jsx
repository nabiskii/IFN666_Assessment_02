import { useState, useEffect } from 'react';
import { Button, Loader, Alert, Title, TextInput, Select, Group, Pagination } from '@mantine/core';
import ShelterList from '../components/Shelter/ShelterList';
import ShelterForm from '../components/Shelter/ShelterForm';
import ShelterDeleteConfirm from '../components/Shelter/ShelterDeleteConfirm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('jwt');
  const isAuthenticated = !!token;
  const isAdmin = (() => {
    if (!token) return false;
    try {
      return JSON.parse(atob(token.split('.')[1])).is_admin;
    } catch { return false; }
  })();

  const fetchShelters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10, sort });
      if (search) params.append('search', search);
      const response = await fetch(`${API_BASE_URL}/shelters?${params}`);
      const data = await response.json();
      setShelters(data);

      const linkHeader = response.headers.get('Link');
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
      setError('Failed to fetch shelters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, [page, sort]);

  const handleSearch = () => {
    setPage(1);
    fetchShelters();
  };

  const handleCreate = async (shelterData) => {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`${API_BASE_URL}/shelters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(shelterData),
    });
    if (response.ok) {
      setModalOpened(false);
      fetchShelters();
    }
  };

  const handleUpdate = async (shelterData) => {
    const response = await fetch(`${API_BASE_URL}/shelters/${selectedShelter._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(shelterData),
    });
    if (response.ok) {
      setModalOpened(false);
      fetchShelters();
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`${API_BASE_URL}/shelters/${selectedShelter._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.ok) {
      setDeleteDialogOpened(false);
      fetchShelters();
    }
  };

  const openCreateModal = () => {
    setIsUpdateMode(false);
    setSelectedShelter(null);
    setModalOpened(true);
  };

  const openUpdateModal = (shelter) => {
    setIsUpdateMode(true);
    setSelectedShelter(shelter);
    setModalOpened(true);
  };

  const openDeleteDialog = (shelter) => {
    setSelectedShelter(shelter);
    setDeleteDialogOpened(true);
  };

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <>
      <Title order={2} mb="md">Shelters</Title>
      <Group mb="md" wrap="wrap">
        <TextInput
          placeholder="Search shelters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1, minWidth: 200, maxWidth: 400 }}
        />
        <Select
          value={sort}
          onChange={setSort}
          data={[
            { value: 'name', label: 'Name (A-Z)' },
            { value: '-name', label: 'Name (Z-A)' },
            { value: 'address', label: 'Address (A-Z)' },
            { value: '-address', label: 'Address (Z-A)' },
          ]}
          w={180}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Group>
      {isAdmin && <Button onClick={openCreateModal} mb="md">Add Shelter</Button>}
      <ShelterList
        shelters={shelters}
        onEdit={isAdmin ? openUpdateModal : null}
        onDelete={isAdmin ? openDeleteDialog : null}
      />
      {totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination value={page} onChange={setPage} total={totalPages} />
        </Group>
      )}
      <ShelterForm
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        isUpdateMode={isUpdateMode}
        selectedShelter={selectedShelter}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
      <ShelterDeleteConfirm
        opened={deleteDialogOpened}
        onClose={() => setDeleteDialogOpened(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default Shelters;
