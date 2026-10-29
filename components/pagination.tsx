
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  page: number;
  totalPages: number;
  size: number;
};

const pageButton =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";

export function Pagination({
  page,
  totalPages,
  size,
}: PaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateUrl(nextPage: number, nextSize = size) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(nextPage));
    params.set("size", String(nextSize));

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <label htmlFor="page-size">Rows per page</label>

        <select
          id="page-size"
          value={size}
          onChange={(event) => updateUrl(1, Number(event.target.value))}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 focus:outline-none"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => updateUrl(page - 1)}
          disabled={page <= 1}
          className={`${pageButton} border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}
        >
          ← Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => updateUrl(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
              className={`${pageButton} ${
                pageNumber === page
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => updateUrl(page + 1)}
          disabled={page >= totalPages}
          className={`${pageButton} border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}
        >
          Next →
        </button>
      </div>
    </nav>
  );
}
