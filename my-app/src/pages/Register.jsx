import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/authSlice';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    console.log("result", result);
    if (result.meta.requestStatus === 'fulfilled') navigate('/login');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <form
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Create an Account 🌟</h2>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">{error}</p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
          onChange={handleChange}
          required
        />

        <button
          className="w-full bg-green-600 hover:bg-green-700 transition-all text-white font-semibold py-3 rounded-xl shadow"
        >
          ✅ Register
        </button>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link
            to="/"
            className="text-green-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
