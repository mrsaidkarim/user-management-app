
"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { inputBase } from "@/lib/styles";

type UserFiltersProps = {
  initialSearch: string;
  initialRole: string;
};

export function UserFilters({
  initialSearch,
  initialRole,
}: UserFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState(initialRole);

  const [syncedFrom, setSyncedFrom] = useState({
    search: initialSearch,
    role: initialRole,
  });

  // Keep the inputs in sync when URL navigation changes their values.
  // Adjusting state during render avoids the extra pass an effect would cause.
  if (
    syncedFrom.search !== initialSearch ||
    syncedFrom.role !== initialRole
  ) {
    setSyncedFrom({ search: initialSearch, role: initialRole });
    setSearch(initialSearch);
    setRole(initialRole);
  }

  // Update the search URL after typing pauses.
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const value = search.trim();

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      const query = params.toString();
      const currentQuery = searchParams.toString();

      if (query !== currentQuery) {
        router.replace(`${pathname}?${query}`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, pathname, router, searchParams]);

  function handleRoleChange(nextRole: string) {
    setRole(nextRole);

    const params = new URLSearchParams(searchParams.toString());

    if (nextRole) {
      params.set("role", nextRole);
    } else {
      params.delete("role");
    }

    // Preserve the current search input when changing roles.
    const value = search.trim();

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full sm:w-72">
        <label htmlFor="user-search" className="sr-only">
          Search by name
        </label>

        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>

        <input
          id="user-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name..."
          className={`${inputBase} pl-9`}
        />
      </div>

      <div className="w-full sm:w-44">
        <label htmlFor="user-role" className="sr-only">
          Filter by role
        </label>

        <select
          id="user-role"
          value={role}
          onChange={(event) => handleRoleChange(event.target.value)}
          className={inputBase}
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
      </div>
    </div>
  );
}
