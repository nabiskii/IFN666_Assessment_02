import { SimpleGrid, Text } from '@mantine/core';
import ApplicationItem from './ApplicationItem';

function ApplicationList({ applications, onEdit, onDelete }) {
  if (applications.length === 0) return <Text>No applications found.</Text>;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
      {applications.map((application) => (
        <ApplicationItem
          key={application._id}
          application={application}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </SimpleGrid>
  );
}

export default ApplicationList;
