import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../redux/taskSlice';
import { logout } from '../redux/authSlice';
import TaskItem from '../components/TaskItem';
import Pagination from '../components/Pagination';

export default function Tasks() {
  const dispatch = useDispatch();
  const { tasks, error } = useSelector(state => state.tasks);
  const [query, setQuery] = useState({ page: 1, status: '', name: '', date: '' });
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    dispatch(fetchTasks(query));
  }, [dispatch, query]);

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createTask(form)).then(() => setForm({ name: '', description: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">📝 My Tasks</h1>
          <button
            onClick={() => dispatch(logout())}
            className="text-sm bg-red-100 text-red-600 hover:bg-red-200 transition-all px-4 py-2 rounded-md font-medium"
          >
            Logout
          </button>
        </div>

        {/* Create Form */}
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Task Name"
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-xl shadow">
            ➕ Add Task
          </button>
        </form>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            placeholder="🔍 Search by name"
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={e => setQuery({ ...query, name: e.target.value, page: 1 })}
          />
          <input
            type="date"
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={e => setQuery({ ...query, date: e.target.value, page: 1 })}
          />
          <select
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={e => setQuery({ ...query, status: e.target.value, page: 1 })}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">⏳ Pending</option>
            <option value="DONE">✅ Done</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        {/* Task List */}
        <div className="space-y-4">
          {tasks && tasks.length > 0 ? (
            tasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onUpdate={update => dispatch(updateTask(update))}
                onDelete={id => dispatch(deleteTask(id))}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 italic">No tasks found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="pt-4 border-t">
          <Pagination current={query.page} onPageChange={p => setQuery({ ...query, page: p })} />
        </div>
      </div>
    </div>
  );
}
