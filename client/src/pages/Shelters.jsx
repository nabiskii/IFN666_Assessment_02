import { useState, useEffect } from 'react';
import { Button, Loader, Alert, Title } from '@mantine/core';
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

  const fetchShelters = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/shelters`);
      const data = await response.json();
      setShelters(data);
    } catch (err) {
      setError('Failed to fetch shelters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleCreate = async (shelterData) => {
    const response = await fetch(`${API_BASE_URL}/shelters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      <Button onClick={openCreateModal} mb="md">Add Shelter</Button>
      <ShelterList
        shelters={shelters}
        onEdit={openUpdateModal}
        onDelete={openDeleteDialog}
      />
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
