import { useState, useEffect } from 'react';
import { Modal, TextInput, Textarea, Button, Group } from '@mantine/core';

function ShelterForm({ opened, onClose, isUpdateMode, selectedShelter, onCreate, onUpdate }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isUpdateMode && selectedShelter) {
      setName(selectedShelter.name || '');
      setAddress(selectedShelter.address || '');
      setPhone(selectedShelter.phone || '');
      setEmail(selectedShelter.email || '');
      setDescription(selectedShelter.description || '');
    } else {
      setName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setDescription('');
    }
  }, [isUpdateMode, selectedShelter, opened]);

  const handleSubmit = () => {
    const shelterData = { name, address, phone, email, description };
    if (isUpdateMode) {
      onUpdate(shelterData);
    } else {
      onCreate(shelterData);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={isUpdateMode ? 'Update Shelter' : 'Add Shelter'}>
      <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextInput label="Address" mt="sm" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <TextInput label="Phone" mt="sm" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <TextInput label="Email" mt="sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Textarea label="Description" mt="sm" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{isUpdateMode ? 'Update' : 'Create'}</Button>
      </Group>
    </Modal>
  );
}

export default ShelterForm;
