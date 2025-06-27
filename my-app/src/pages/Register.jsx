import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/authSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector(state => state.auth);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (result.meta.requestStatus === 'fulfilled') navigate('/tasks');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-4">Register</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input name="email" type="email" placeholder="Email" className="w-full mb-2 p-2 border rounded" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="w-full mb-2 p-2 border rounded" onChange={handleChange} required />
        <button className="w-full bg-green-500 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}