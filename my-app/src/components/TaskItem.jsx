export default function TaskItem({ task, onUpdate, onDelete }) {
  return (
    <div className="border p-2 rounded mb-2 flex justify-between items-center">
      <div>
        <h3 className="font-bold">{task.name}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
      </div>
      <div className="flex gap-2">
        <select value={task.status} onChange={e => onUpdate({ id: task._id, data: { status: e.target.value } })} className="border rounded p-1">
          <option value="PENDING">PENDING</option>
          <option value="DONE">DONE</option>
        </select>
        <button onClick={() => onDelete(task._id)} className="text-red-500 text-sm">Delete</button>
      </div>
    </div>
  );
}