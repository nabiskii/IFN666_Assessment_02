import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, Alert, Title, TextInput, Select, Group, Pagination } from '@mantine/core';
import PetList from '../components/Pet/PetList';
import PetForm from '../components/Pet/PetForm';
import ApplicationForm from '../components/Application/ApplicationForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Pets() {
  const [pets, setPets] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [appModalOpened, setAppModalOpened] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [preselectedPet, setPreselectedPet] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const token = localStorage.getItem('jwt');
  const isAuthenticated = !!token;
  const isAdmin = (() => {
    if (!token) return false;
    try {
      return JSON.parse(atob(token.split('.')[1])).is_admin;
    } catch { return false; }
  })();

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10, sort });
      if (search) params.append('search', search);
      const [petsRes, sheltersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/pets?${params}`),
        fetch(`${API_BASE_URL}/shelters`),
      ]);
      const petsData = await petsRes.json();
      const sheltersData = await sheltersRes.json();
      setPets(petsData);
      setShelters(sheltersData);

      const linkHeader = petsRes.headers.get('Link');
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
      setError('Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [page, sort]);

  const handleSearch = () => {
    setPage(1);
    fetchPets();
  };

  const handleCreate = async (petData) => {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(petData),
    });
    if (response.ok) {
      setModalOpened(false);
      fetchPets();
    }
  };

  const handleUpdate = async (petData) => {
    const response = await fetch(`${API_BASE_URL}/pets/${selectedPet._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(petData),
    });
    if (response.ok) {
      setModalOpened(false);
      fetchPets();
    }
  };

  const handleDelete = async (pet) => {
    const response = await fetch(`${API_BASE_URL}/pets/${pet._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.ok) fetchPets();
  };

  const openCreateModal = () => {
    setIsUpdateMode(false);
    setSelectedPet(null);
    setModalOpened(true);
  };

  const openUpdateModal = (pet) => {
    setIsUpdateMode(true);
    setSelectedPet(pet);
    setModalOpened(true);
  };

  const handleApply = (pet) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setPreselectedPet(pet);
    setAppModalOpened(true);
  };

  const handleCreateApplication = async (appData) => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(appData),
    });
    if (response.ok) {
      setAppModalOpened(false);
      setPreselectedPet(null);
      navigate('/applications');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <>
      <Title order={2} mb="md">Pets</Title>
      <Group mb="md" wrap="wrap">
        <TextInput
          placeholder="Search pets..."
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
            { value: 'species', label: 'Species (A-Z)' },
            { value: '-species', label: 'Species (Z-A)' },
            { value: 'age', label: 'Age (Low-High)' },
            { value: '-age', label: 'Age (High-Low)' },
          ]}
          w={180}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Group>
      {isAdmin && <Button onClick={openCreateModal} mb="md">Add Pet</Button>}
      <PetList
        pets={pets}
        onEdit={isAdmin ? openUpdateModal : null}
        onDelete={isAdmin ? handleDelete : null}
        onApply={!isAdmin ? handleApply : null}
      />
      {totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination value={page} onChange={setPage} total={totalPages} />
        </Group>
      )}
      <PetForm
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        isUpdateMode={isUpdateMode}
        selectedPet={selectedPet}
        shelters={shelters}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
      <ApplicationForm
        opened={appModalOpened}
        onClose={() => { setAppModalOpened(false); setPreselectedPet(null); }}
        isUpdateMode={false}
        selectedApplication={preselectedPet ? { pet: preselectedPet._id } : null}
        pets={pets}
        onCreate={handleCreateApplication}
        onUpdate={() => {}}
      />
    </>
  );
}

export default Pets;
