import { useEffect } from 'react';
import { Modal, TextInput, Textarea, Select, NumberInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';

function PetForm({ opened, onClose, isUpdateMode, selectedPet, shelters, onCreate, onUpdate }) {
  const form = useForm({
    initialValues: {
      name: '',
      species: '',
      breed: '',
      age: 0,
      gender: '',
      description: '',
      personality: '',
      likes: '',
      dislikes: '',
      imageUrl: '',
      status: 'available',
      shelter: '',
    },
    validate: {
      name: (value) => (value.length === 0 ? 'Name is required' : null),
      species: (value) => (value ? null : 'Species is required'),
      breed: (value) => (value.length === 0 ? 'Breed is required' : null),
      age: (value) => (value < 0 ? 'Age must be a positive number' : null),
      gender: (value) => (value ? null : 'Gender is required'),
      description: (value) => (value.length === 0 ? 'Description is required' : null),
      shelter: (value) => (value ? null : 'Shelter is required'),
      imageUrl: (value) => {
        if (value && !/^https?:\/\/.+/.test(value)) return 'Must be a valid URL';
        return null;
      },
    },
  });

  useEffect(() => {
    if (isUpdateMode && selectedPet) {
      form.setValues({
        name: selectedPet.name || '',
        species: selectedPet.species || '',
        breed: selectedPet.breed || '',
        age: selectedPet.age || 0,
        gender: selectedPet.gender || '',
        description: selectedPet.description || '',
        personality: selectedPet.personality || '',
        likes: selectedPet.likes || '',
        dislikes: selectedPet.dislikes || '',
        imageUrl: selectedPet.imageUrl || '',
        status: selectedPet.status || 'available',
        shelter: selectedPet.shelter?._id || selectedPet.shelter || '',
      });
    } else {
      form.reset();
    }
  }, [isUpdateMode, selectedPet, opened]);

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    if (isUpdateMode) {
      onUpdate(form.values);
    } else {
      onCreate(form.values);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={isUpdateMode ? 'Update Pet' : 'Add Pet'}>
      <TextInput label="Name" description="Pet's name" {...form.getInputProps('name')} required />
      <Select
        label="Species"
        description="Type of animal"
        mt="sm"
        data={['dog', 'cat', 'bird', 'rabbit', 'other']}
        {...form.getInputProps('species')}
        required
      />
      <TextInput label="Breed" description="Breed or mix" mt="sm" {...form.getInputProps('breed')} required />
      <NumberInput label="Age" description="Age in years" mt="sm" min={0} {...form.getInputProps('age')} required />
      <Select
        label="Gender"
        mt="sm"
        data={['male', 'female']}
        {...form.getInputProps('gender')}
        required
      />
      <Textarea label="Description" description="Describe the pet" mt="sm" {...form.getInputProps('description')} required />
      <TextInput label="Personality" description="e.g. Playful, loyal, calm" mt="sm" {...form.getInputProps('personality')} />
      <TextInput label="Likes" description="Comma separated, e.g. Belly rubs, swimming, fetch" mt="sm" {...form.getInputProps('likes')} />
      <TextInput label="Dislikes" description="Comma separated, e.g. Loud noises, being alone" mt="sm" {...form.getInputProps('dislikes')} />
      <TextInput label="Image URL" description="Link to a photo of the pet" mt="sm" {...form.getInputProps('imageUrl')} />
      <Select
        label="Status"
        mt="sm"
        data={['available', 'pending', 'adopted']}
        {...form.getInputProps('status')}
      />
      <Select
        label="Shelter"
        description="Which shelter is this pet at"
        mt="sm"
        data={shelters.map((s) => ({ value: s._id, label: s.name }))}
        {...form.getInputProps('shelter')}
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
