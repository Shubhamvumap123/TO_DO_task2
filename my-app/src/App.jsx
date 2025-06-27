import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

export default function App() {
  const { token } = useSelector(state => state.auth);
  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/tasks" />} />
      <Route path="/register" element={!token ? <Register /> : <Navigate to="/tasks" />} />
      <Route path="/tasks" element={token ? <Tasks /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={token ? "/tasks" : "/login"} />} />
    </Routes>
  );
}