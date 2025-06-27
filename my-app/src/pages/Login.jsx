import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector(state => state.auth);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (result.meta.requestStatus === 'fulfilled') navigate('/tasks');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <form
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back 👋</h2>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">{error}</p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={handleChange}
          required
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-3 rounded-xl shadow"
        >
          🔐 Login
        </button>

        <p className="text-sm text-gray-600 text-center">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
