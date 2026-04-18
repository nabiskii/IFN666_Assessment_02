import { useEffect } from 'react';
import { Modal, TextInput, Textarea, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';

function ShelterForm({ opened, onClose, isUpdateMode, selectedShelter, onCreate, onUpdate }) {
  const form = useForm({
    initialValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      description: '',
    },
    validate: {
      name: (value) => (value.length === 0 ? 'Name is required' : null),
      address: (value) => (value.length === 0 ? 'Address is required' : null),
      phone: (value) => (value.length === 0 ? 'Phone is required' : null),
      email: (value) => {
        if (value.length === 0) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Must be a valid email address';
        return null;
      },
    },
  });

  useEffect(() => {
    if (isUpdateMode && selectedShelter) {
      form.setValues({
        name: selectedShelter.name || '',
        address: selectedShelter.address || '',
        phone: selectedShelter.phone || '',
        email: selectedShelter.email || '',
        description: selectedShelter.description || '',
      });
    } else {
      form.reset();
    }
  }, [isUpdateMode, selectedShelter, opened]);

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    if (isUpdateMode) {
      onUpdate(form.values);
    } else {
      onCreate(form.values);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={isUpdateMode ? 'Update Shelter' : 'Add Shelter'}>
      <TextInput label="Name" description="Shelter name" {...form.getInputProps('name')} required />
      <TextInput label="Address" description="Full street address" mt="sm" {...form.getInputProps('address')} required />
      <TextInput label="Phone" description="Contact phone number" mt="sm" {...form.getInputProps('phone')} required />
      <TextInput label="Email" description="Contact email address" mt="sm" {...form.getInputProps('email')} required />
      <Textarea label="Description" description="Optional description of the shelter" mt="sm" {...form.getInputProps('description')} />
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{isUpdateMode ? 'Update' : 'Create'}</Button>
      </Group>
    </Modal>
  );
}

export default ShelterForm;
