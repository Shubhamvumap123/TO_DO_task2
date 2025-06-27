export default function Pagination({ current, onPageChange }) {
  return (
    <div className="flex justify-center mt-6 gap-4 items-center text-sm">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className={`px-4 py-2 rounded-xl shadow-sm font-medium transition-all
          ${current === 1
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'}
        `}
      >
        ⬅ Prev
      </button>

      <span className="text-gray-700 font-semibold tracking-wide">
        Page <span className="text-blue-600">{current}</span>
      </span>

      <button
        onClick={() => onPageChange(current + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-all font-medium"
      >
        Next ➡
      </button>
    </div>
  );
}
