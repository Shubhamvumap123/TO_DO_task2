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
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('draft');
    return saved ? JSON.parse(saved) : { name: '', description: '', priority: 'Medium' };
  });
  const [sortBy, setSortBy] = useState('latest');
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [deletedTask, setDeletedTask] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    dispatch(fetchTasks(query));
  }, [dispatch, query]);

  useEffect(() => {
    localStorage.setItem('draft', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createTask(form)).then(() => setForm({ name: '', description: '', priority: 'Medium' }));
  };

  const sortedTasks = [...(tasks || [])].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'DONE').length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const quickTemplates = ['Call Mom', 'Buy Groceries', 'Water Plants'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-bold">📝 My Tasks</h1>
          <div className="space-x-2">
            <button onClick={() => setDark(!dark)} className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">{dark ? '🌞 Light' : '🌙 Dark'}</button>
            <button onClick={() => dispatch(logout())} className="text-sm bg-red-100 text-red-600 hover:bg-red-200 transition-all px-4 py-2 rounded-md font-medium">Logout</button>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="flex gap-2 flex-wrap">
          {quickTemplates.map(title => (
            <button key={title} onClick={() => setForm({ ...form, name: title })} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
              {title}
            </button>
          ))}
        </div>

        {/* Create Form */}
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Task Name" className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none" required />
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-xl shadow">➕ Add Task</button>
        </form>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input id="searchInput" placeholder="🔍 Search by name" className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={e => setQuery({ ...query, name: e.target.value, page: 1 })} />
          <input type="date" className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={e => setQuery({ ...query, date: e.target.value, page: 1 })} />
          <select className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl" onChange={e => setQuery({ ...query, status: e.target.value, page: 1 })}>
            <option value="">All Statuses</option>
            <option value="PENDING">⏳ Pending</option>
            <option value="DONE">✅ Done</option>
          </select>
          <select className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl" onChange={e => setSortBy(e.target.value)}>
            <option value="latest">📅 Latest</option>
            <option value="name">🔤 A-Z</option>
          </select>
        </div>

        {/* Progress */}
        <div>
          <div className="w-full bg-gray-200 rounded h-4 dark:bg-gray-600">
            <div className="bg-green-500 h-4 rounded" style={{ width: `${percent}%` }} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{percent}% done</p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        {/* Task List */}
        <div className="space-y-4">
          {sortedTasks && sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onUpdate={update => dispatch(updateTask(update))}
                onDelete={id => {
                  setDeletedTask(tasks.find(t => t._id === id));
                  dispatch(deleteTask(id));
                }}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 italic">No tasks found.</p>
          )}
        </div>

        {/* Undo Delete */}
        {deletedTask && (
          <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-700 p-4 shadow rounded-lg">
            <p className="text-sm">Task deleted.</p>
            <button onClick={() => {
              dispatch(createTask(deletedTask));
              setDeletedTask(null);
            }} className="text-blue-500 underline text-sm">Undo</button>
          </div>
        )}

        {/* Pagination */}
        <div className="pt-4 border-t">
          <Pagination current={query.page} onPageChange={p => setQuery({ ...query, page: p })} />
        </div>
      </div>
    </div>
  );
}
