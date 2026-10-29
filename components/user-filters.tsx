
"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

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

  // Keep the inputs in sync when URL navigation changes their values.
  useEffect(() => {
    setSearch(initialSearch);
    setRole(initialRole);
  }, [initialSearch, initialRole]);

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
    <div className="mt-6 flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="user-search" className="text-sm font-medium">
          Search by name
        </label>

        <input
          id="user-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Enter a name..."
          className="rounded border px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="user-role" className="text-sm font-medium">
          Filter by role
        </label>

        <select
          id="user-role"
          value={role}
          onChange={(event) => handleRoleChange(event.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
      </div>
    </div>
  );
}
