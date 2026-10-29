"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteUserButtonProps = {
  userId: string;
  userName: string;
};

export function DeleteUserButton({
  userId,
  userName,
}: DeleteUserButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? "Failed to delete user.");
        return;
      }

      router.refresh();
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-md px-2.5 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>

      {error && <p role="alert" className="mt-1 max-w-48 text-xs text-red-600">{error}</p>}
    </div>
  );
}