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
console.log("tasks",tasks)
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl">My Tasks</h1>
        <button onClick={() => dispatch(logout())} className="text-sm text-red-500">Logout</button>
      </div>
      <form className="mb-4 flex flex-col gap-2" onSubmit={handleCreate}>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Task Name" className="border p-2 rounded" required />
        <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="border p-2 rounded" />
        <button className="bg-blue-500 text-white p-2 rounded">Add Task</button>
      </form>
      <div className="flex gap-2 mb-4">
        <input placeholder="Search by name" className="border p-2 rounded flex-1" onChange={e => setQuery({ ...query, name: e.target.value, page: 1 })} />
        <input type="date" className="border p-2 rounded" onChange={e => setQuery({ ...query, date: e.target.value, page: 1 })} />
        <select className="border p-2 rounded" onChange={e => setQuery({ ...query, status: e.target.value, page: 1 })}>
          <option value="">All</option>
          <option value="PENDING">PENDING</option>
          <option value="DONE">DONE</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {tasks && tasks.map(task => <TaskItem key={task._id} task={task} onUpdate={update => dispatch(updateTask(update))} onDelete={id => dispatch(deleteTask(id))} />)}
      <Pagination current={query.page} onPageChange={p => setQuery({ ...query, page: p })} />
    </div>
  );
}
