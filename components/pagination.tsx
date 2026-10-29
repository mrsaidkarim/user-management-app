
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  page: number;
  totalPages: number;
  size: number;
};

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
      className="mt-6 flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2">
        <label htmlFor="page-size">Rows per page:</label>

        <select
          id="page-size"
          value={size}
          onChange={(event) => updateUrl(1, Number(event.target.value))}
          className="rounded border px-2 py-1"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => updateUrl(page - 1)}
          disabled={page <= 1}
          className="rounded border px-3 py-1 disabled:opacity-40"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => updateUrl(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
              className={`rounded border px-3 py-1 ${
                pageNumber === page ? "bg-black text-white" : ""
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
          className="rounded border px-3 py-1 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
