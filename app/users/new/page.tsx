import Link from "next/link";
import { UserForm } from "@/components/user-form";
import { backLink } from "@/lib/styles";

export default function NewUserPage() {
  return (
    <main className="space-y-6">
      <div>
        <Link href="/users" className={backLink}>
          ← Back to users
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Create user</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new user to the system.
        </p>
      </div>

      <UserForm mode="create" />
    </main>
  );
}
