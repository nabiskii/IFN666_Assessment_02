import { Modal, Text, Group, Button } from '@mantine/core';

function PetDeleteConfirm({ opened, onClose, onConfirm }) {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Deletion">
      <Text>Are you sure you want to delete this pet?</Text>
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button color="red" onClick={onConfirm}>Delete</Button>
      </Group>
    </Modal>
  );
}

export default PetDeleteConfirm;
