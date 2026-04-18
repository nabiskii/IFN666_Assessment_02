import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, Alert, Title, TextInput, Select, Group, Pagination } from '@mantine/core';
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
  const navigate = useNavigate();

  const token = localStorage.getItem('jwt');

  const getUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    } catch {
      return null;
    }
  };

  const userId = getUserId();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const [appsRes, petsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users/${userId}/applications`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
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

  const handleCreate = async (appData) => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
      headers: { 'Authorization': `Bearer ${token}` },
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

  if (!token) return null;
  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <>
      <Title order={2} mb="md">My Applications</Title>
      <Button onClick={openCreateModal} mb="md">New Application</Button>
      {applications.length === 0 ? (
        <Alert color="blue" variant="light">
          You haven't submitted any adoption applications yet. Click "New Application" to get started.
        </Alert>
      ) : (
        <ApplicationList
          applications={applications}
          onEdit={openUpdateModal}
          onDelete={handleDelete}
        />
      )}
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
