export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition-all hover:border-gray-300 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <i className="fi fi-rr-angle-small-left mt-1"></i>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50/50 p-1">
        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold transition-all ${
              currentPage === pageNum
                ? "bg-white text-[#ff6b35] shadow-sm ring-1 ring-black/5"
                : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition-all hover:border-gray-300 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <i className="fi fi-rr-angle-small-right mt-1"></i>
      </button>
    </div>
  );
}