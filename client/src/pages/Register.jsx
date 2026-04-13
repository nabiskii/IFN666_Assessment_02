import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Alert, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length === 0 ? 'Username is required' : null),
      password: (value) => (value.length < 3 ? 'Password must be at least 3 characters' : null),
    },
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.validate().hasErrors) {
      setLoading(false);
      return;
    }

    const { username, password } = form.values;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <Title order={2} mb="md">Register</Title>
      {error && <Alert color="red" mb="sm">{error}</Alert>}
      <form onSubmit={handleRegister}>
        <TextInput
          label="Username"
          {...form.getInputProps('username')}
          required
        />
        <PasswordInput
          label="Password"
          mt="sm"
          {...form.getInputProps('password')}
          required
        />
        <Button type="submit" fullWidth mt="md" loading={loading} disabled={loading}>
          Register
        </Button>
      </form>
    </div>
  );
}

export default Register;
