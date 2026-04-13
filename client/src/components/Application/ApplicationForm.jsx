import { useState, useEffect } from 'react';
import { Modal, Select, Textarea, Button, Group } from '@mantine/core';

function ApplicationForm({ opened, onClose, isUpdateMode, selectedApplication, pets, onCreate, onUpdate }) {
  const [pet, setPet] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (isUpdateMode && selectedApplication) {
      setPet(selectedApplication.pet?._id || selectedApplication.pet || '');
      setMessage(selectedApplication.message || '');
      setStatus(selectedApplication.status || 'pending');
    } else {
      setPet('');
      setMessage('');
      setStatus('pending');
    }
  }, [isUpdateMode, selectedApplication, opened]);

  const handleSubmit = () => {
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

    const appData = { pet, message, status, applicant };
    if (isUpdateMode) {
      onUpdate(appData);
    } else {
      onCreate(appData);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={isUpdateMode ? 'Update Application' : 'New Application'}>
      <Select
        label="Pet"
        value={pet}
        onChange={setPet}
        data={pets.map((p) => ({ value: p._id, label: `${p.name} (${p.species})` }))}
        required
      />
      <Textarea label="Message" mt="sm" value={message} onChange={(e) => setMessage(e.target.value)} required />
      {isUpdateMode && (
        <Select
          label="Status"
          mt="sm"
          value={status}
          onChange={setStatus}
          data={['pending', 'approved', 'rejected']}
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
