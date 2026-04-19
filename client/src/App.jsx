import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
});
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Shelters from './pages/Shelters';
import Pets from './pages/Pets';
import Applications from './pages/Applications';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ShelterDetail from './pages/ShelterDetail';
import PetDetail from './pages/PetDetail';
import ApplicationDetail from './pages/ApplicationDetail';
import NoPage from './pages/NoPage';
import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter basename="/assignment2">
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shelters" element={<Shelters />} />
            <Route path="shelters/:id" element={<ShelterDetail />} />
            <Route path="pets" element={<Pets />} />
            <Route path="pets/:id" element={<PetDetail />} />
            <Route path="applications" element={<Applications />} />
            <Route path="applications/:id" element={<ApplicationDetail />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App;
