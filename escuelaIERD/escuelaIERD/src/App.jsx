import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Admin from './pages/Admin/Admin';
import Profesor from './pages/Profesor/Profesor';
import Estudiante from './pages/Estudiante/Estudiante';
import VerificarDB from './pages/VerificarDB/VerificarDB';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-club-green text-lg font-semibold">Cargando...</div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Verificar si el usuario tiene el rol permitido
  const userRol = user.rol || user.role; // Por si acaso
  if (allowedRoles && !allowedRoles.includes(userRol)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profesor/*" 
          element={
            <ProtectedRoute allowedRoles={['profesor']}>
              <Profesor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/estudiante/*" 
          element={
            <ProtectedRoute allowedRoles={['estudiante', 'padre']}>
              <Estudiante />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/verificar-db" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VerificarDB />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;