import { useEffect } from 'react';
import { Modal, Select, Textarea, Button, Group, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';

function ApplicationForm({ opened, onClose, isUpdateMode, selectedApplication, pets, onCreate, onUpdate }) {
  const form = useForm({
    initialValues: {
      pet: '',
      message: '',
      status: 'pending',
    },
    validate: {
      pet: (value) => (value ? null : 'Please select a pet'),
      message: (value) => {
        if (value.length === 0) return 'Message is required';
        if (value.length < 10) return 'Message must be at least 10 characters';
        return null;
      },
    },
  });

  useEffect(() => {
    if (isUpdateMode && selectedApplication) {
      form.setValues({
        pet: selectedApplication.pet?._id || selectedApplication.pet || '',
        message: selectedApplication.message || '',
        status: selectedApplication.status || 'pending',
      });
    } else if (selectedApplication?.pet) {
      form.setValues({
        pet: selectedApplication.pet?._id || selectedApplication.pet || '',
        message: '',
        status: 'pending',
      });
    } else {
      form.reset();
    }
  }, [isUpdateMode, selectedApplication, opened]);

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;

    const token = localStorage.getItem('jwt');
    let applicant = null;

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        applicant = payload.user_id;
      } catch (err) {
        applicant = null;
      }
    }

    const appData = { ...form.values, applicant };
    if (isUpdateMode) {
      onUpdate(appData);
    } else {
      onCreate(appData);
    }
  };

  const token = localStorage.getItem('jwt');
  if (!token && opened && !isUpdateMode) {
    return (
      <Modal opened={opened} onClose={onClose} title="New Application">
        <Alert color="yellow">You must be logged in to submit an application.</Alert>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>Close</Button>
        </Group>
      </Modal>
    );
  }

  return (
    <Modal opened={opened} onClose={onClose} title={isUpdateMode ? 'Update Application' : 'New Application'}>
      <Select
        label="Pet"
        description="Select the pet you want to adopt"
        data={pets.map((p) => ({ value: p._id, label: `${p.name} (${p.species})` }))}
        {...form.getInputProps('pet')}
        required
      />
      <Textarea
        label="Message"
        description="Tell us why you'd like to adopt this pet (min 10 characters)"
        mt="sm"
        {...form.getInputProps('message')}
        required
      />
      {isUpdateMode && (
        <Select
          label="Status"
          mt="sm"
          data={['pending', 'approved', 'rejected']}
          {...form.getInputProps('status')}
        />
      )}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{isUpdateMode ? 'Update' : 'Submit'}</Button>
      </Group>
    </Modal>
  );
}

export default ApplicationForm;
