import { useState, useEffect } from 'react';
import { Button, Loader, Alert, Title } from '@mantine/core';
import ApplicationList from '../components/Application/ApplicationList';
import ApplicationForm from '../components/Application/ApplicationForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Applications() {
  const [applications, setApplications] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const [appsRes, petsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/applications`),
        fetch(`${API_BASE_URL}/pets`),
      ]);
      const appsData = await appsRes.json();
      const petsData = await petsRes.json();
      setApplications(appsData);
      setPets(petsData);
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreate = async (appData) => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData),
    });
    if (response.ok) {
      setModalOpened(false);
      fetchApplications();
    }
  };

  const handleUpdate = async (appData) => {
    const response = await fetch(`${API_BASE_URL}/applications/${selectedApplication._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData),
    });
    if (response.ok) {
      setModalOpened(false);
      fetchApplications();
    }
  };

  const handleDelete = async (application) => {
    const response = await fetch(`${API_BASE_URL}/applications/${application._id}`, {
      method: 'DELETE',
    });
    if (response.ok) fetchApplications();
  };

  const openCreateModal = () => {
    setIsUpdateMode(false);
    setSelectedApplication(null);
    setModalOpened(true);
  };

  const openUpdateModal = (application) => {
    setIsUpdateMode(true);
    setSelectedApplication(application);
    setModalOpened(true);
  };

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <>
      <Title order={2} mb="md">Adoption Applications</Title>
      <Button onClick={openCreateModal} mb="md">New Application</Button>
      <ApplicationList
        applications={applications}
        onEdit={openUpdateModal}
        onDelete={handleDelete}
      />
      <ApplicationForm
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        isUpdateMode={isUpdateMode}
        selectedApplication={selectedApplication}
        pets={pets}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </>
  );
}

export default Applications;
