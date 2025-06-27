export default function Pagination({ current, onPageChange }) {
  return (
    <div className="flex justify-center mt-4 gap-2">
      <button disabled={current === 1} onClick={() => onPageChange(current - 1)} className="border p-1 rounded">Prev</button>
      <span className="p-1">Page {current}</span>
      <button onClick={() => onPageChange(current + 1)} className="border p-1 rounded">Next</button>
    </div>
  );
}