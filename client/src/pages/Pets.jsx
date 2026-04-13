import { useState, useEffect } from 'react';
import { Button, Loader, Alert, Title } from '@mantine/core';
import PetList from '../components/Pet/PetList';
import PetForm from '../components/Pet/PetForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Pets() {
  const [pets, setPets] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const [petsRes, sheltersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/pets`),
        fetch(`${API_BASE_URL}/shelters`),
      ]);
      const petsData = await petsRes.json();
      const sheltersData = await sheltersRes.json();
      setPets(petsData);
      setShelters(sheltersData);
    } catch (err) {
      setError('Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleCreate = async (petData) => {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <>
      <Title order={2} mb="md">Pets</Title>
      <Button onClick={openCreateModal} mb="md">Add Pet</Button>
      <PetList
        pets={pets}
        onEdit={openUpdateModal}
        onDelete={handleDelete}
      />
      <PetForm
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        isUpdateMode={isUpdateMode}
        selectedPet={selectedPet}
        shelters={shelters}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </>
  );
}

export default Pets;
