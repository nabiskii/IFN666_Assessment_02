import { useState, useEffect } from 'react';
import { Modal, TextInput, Textarea, Select, NumberInput, Button, Group } from '@mantine/core';

function PetForm({ opened, onClose, isUpdateMode, selectedPet, shelters, onCreate, onUpdate }) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('available');
  const [shelter, setShelter] = useState('');

  useEffect(() => {
    if (isUpdateMode && selectedPet) {
      setName(selectedPet.name || '');
      setSpecies(selectedPet.species || '');
      setBreed(selectedPet.breed || '');
      setAge(selectedPet.age || 0);
      setGender(selectedPet.gender || '');
      setDescription(selectedPet.description || '');
      setStatus(selectedPet.status || 'available');
      setShelter(selectedPet.shelter?._id || selectedPet.shelter || '');
    } else {
      setName('');
      setSpecies('');
      setBreed('');
      setAge(0);
      setGender('');
      setDescription('');
      setStatus('available');
      setShelter('');
    }
  }, [isUpdateMode, selectedPet, opened]);

  const handleSubmit = () => {
    const petData = { name, species, breed, age, gender, description, status, shelter };
    if (isUpdateMode) {
      onUpdate(petData);
    } else {
      onCreate(petData);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={isUpdateMode ? 'Update Pet' : 'Add Pet'}>
      <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Select
        label="Species"
        mt="sm"
        value={species}
        onChange={setSpecies}
        data={['dog', 'cat', 'bird', 'rabbit', 'other']}
        required
      />
      <TextInput label="Breed" mt="sm" value={breed} onChange={(e) => setBreed(e.target.value)} required />
      <NumberInput label="Age" mt="sm" value={age} onChange={setAge} min={0} required />
      <Select
        label="Gender"
        mt="sm"
        value={gender}
        onChange={setGender}
        data={['male', 'female']}
        required
      />
      <Textarea label="Description" mt="sm" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <Select
        label="Status"
        mt="sm"
        value={status}
        onChange={setStatus}
        data={['available', 'pending', 'adopted']}
      />
      <Select
        label="Shelter"
        mt="sm"
        value={shelter}
        onChange={setShelter}
        data={shelters.map((s) => ({ value: s._id, label: s.name }))}
        required
      />
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{isUpdateMode ? 'Update' : 'Create'}</Button>
      </Group>
    </Modal>
  );
}

export default PetForm;
