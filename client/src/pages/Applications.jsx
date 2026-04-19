import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, Alert, Title, Group, Pagination } from '@mantine/core';
import ApplicationList from '../components/Application/ApplicationList';
import ApplicationForm from '../components/Application/ApplicationForm';
import ApplicationDeleteConfirm from '../components/Application/ApplicationDeleteConfirm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Applications() {
  const [applications, setApplications] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const token = localStorage.getItem('jwt');

  const getPayload = () => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch { return null; }
  };

  const payload = getPayload();
  const userId = payload?.user_id;
  const isAdmin = payload?.is_admin || false;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [page]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let appsRes;
      if (isAdmin) {
        const params = new URLSearchParams({ page, limit: 10 });
        appsRes = await fetch(`${API_BASE_URL}/applications?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } else {
        appsRes = await fetch(`${API_BASE_URL}/users/${userId}/applications`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }

      const petsRes = await fetch(`${API_BASE_URL}/pets`);
      const appsData = await appsRes.json();
      const petsData = await petsRes.json();
      setApplications(Array.isArray(appsData) ? appsData : []);
      setPets(Array.isArray(petsData) ? petsData : []);

      if (isAdmin) {
        const linkHeader = appsRes.headers.get('Link');
        if (linkHeader) {
          const links = {};
          linkHeader.split(',').forEach(link => {
            const match = link.match(/<([^>]+)>; rel="([^"]+)"/);
            if (match) { links[match[2]] = match[1]; }
          });
          if (links.last) {
            const lastUrl = new URL(links.last, window.location.origin);
            setTotalPages(parseInt(lastUrl.searchParams.get('page')) || 1);
          }
        } else {
          setTotalPages(1);
        }
      }
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (application, newStatus) => {
    const response = await fetch(`${API_BASE_URL}/applications/${application._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        applicant: application.applicant?._id || application.applicant,
        pet: application.pet?._id || application.pet,
        status: newStatus,
        message: application.message,
      }),
    });
    if (response.ok) fetchApplications();
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

  const openDeleteDialog = (application) => {
    setAppToDelete(application);
    setDeleteDialogOpened(true);
  };

  const handleDelete = async () => {
    const response = await fetch(`${API_BASE_URL}/applications/${appToDelete._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.ok) {
      setDeleteDialogOpened(false);
      fetchApplications();
    }
  };

  const openCreateModal = () => {
    setSelectedApplication(null);
    setModalOpened(true);
  };

  if (!token) return null;
  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <>
      <Title order={2} mb="md">{isAdmin ? 'All Applications' : 'My Applications'}</Title>
      {!isAdmin && <Button onClick={openCreateModal} mb="md">New Application</Button>}
      {applications.length === 0 ? (
        <Alert color="blue" variant="light">
          {isAdmin
            ? 'No adoption applications have been submitted yet.'
            : 'You haven\'t submitted any adoption applications yet. Click "New Application" to get started.'}
        </Alert>
      ) : (
        <ApplicationList
          applications={applications}
          onEdit={null}
          onDelete={!isAdmin ? openDeleteDialog : null}
          onApprove={isAdmin ? (app) => handleStatusChange(app, 'approved') : null}
          onReject={isAdmin ? (app) => handleStatusChange(app, 'rejected') : null}
          isAdmin={isAdmin}
        />
      )}
      {isAdmin && totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination value={page} onChange={setPage} total={totalPages} />
        </Group>
      )}
      <ApplicationDeleteConfirm
        opened={deleteDialogOpened}
        onClose={() => setDeleteDialogOpened(false)}
        onConfirm={handleDelete}
      />
      {!isAdmin && (
        <ApplicationForm
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          isUpdateMode={false}
          selectedApplication={selectedApplication}
          pets={pets}
          onCreate={handleCreate}
          onUpdate={() => {}}
        />
      )}
    </>
  );
}

export default Applications;
