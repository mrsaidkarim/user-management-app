import Link from "next/link";
import { buttonPrimary, buttonSecondary } from "@/lib/styles";

export default function Home() {
  return (
    <main className="flex flex-col items-center py-16 text-center sm:py-24">
      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 ring-1 ring-teal-600/20">
        Admin dashboard
      </span>

      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
        User Management
      </h1>

      <p className="mt-4 max-w-md text-gray-600">
        Manage users, roles, and salary information.
      </p>

      <nav className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/users" className={`${buttonPrimary} px-5 py-2.5`}>
          View Users
        </Link>

        <Link href="/projects" className={`${buttonSecondary} px-5 py-2.5`}>
          View Projects
        </Link>
      </nav>
    </main>
  );
}
