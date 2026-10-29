
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-gray-900">
      <h1 className="text-4xl font-bold">User Management</h1>

      <p className="mt-4 text-gray-600">
        Manage users, roles, and salary information.
      </p>

      <nav className="mt-8 flex gap-4">
        <Link
          href="/users"
          className="rounded-md bg-teal-700 px-5 py-3 text-white hover:bg-teal-800"
        >
          View Users
        </Link>

        <Link
          href="/projects"
          className="rounded-md border border-gray-300 px-5 py-3 hover:bg-gray-100"
        >
          View Projects
        </Link>
      </nav>
    </main>
  );
}
