import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AddPropertyPage } from './pages/AddPropertyPage';
import { EditPropertyPage } from './pages/EditPropertyPage';
import { LoginPage } from './pages/LoginPage';
import { MyPropertiesPage } from './pages/MyPropertiesPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<PropertiesPage />} />
            <Route path="properties/:id" element={<PropertyDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute agentOnly />}>
              <Route path="add-property" element={<AddPropertyPage />} />
              <Route path="properties/:id/edit" element={<EditPropertyPage />} />
              <Route path="my-properties" element={<MyPropertiesPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
