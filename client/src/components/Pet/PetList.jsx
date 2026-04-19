import { SimpleGrid, Text } from '@mantine/core';
import PetItem from './PetItem';

function PetList({ pets, onEdit, onDelete, onApply }) {
  if (pets.length === 0) return <Text>No pets found.</Text>;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
      {pets.map((pet) => (
        <PetItem key={pet._id} pet={pet} onEdit={onEdit} onDelete={onDelete} onApply={onApply} />
      ))}
    </SimpleGrid>
  );
}

export default PetList;
