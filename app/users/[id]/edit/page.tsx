import Link from "next/link";
import { notFound } from "next/navigation";
import { UserForm } from "@/components/user-form";
import { getUserById } from "@/lib/services/users";
import { backLink } from "@/lib/styles";

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({
  params,
}: EditUserPageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <div>
        <Link href="/users" className={backLink}>
          ← Back to users
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Edit user</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the user&apos;s information.
        </p>
      </div>

      <UserForm
        mode="edit"
        userId={user.id}
        initialValues={{
          name: user.name,
          email: user.email,
          role: user.role,
          salary: user.salary.toString(),
          startDate: user.startDate.toISOString().slice(0, 10),
        }}
      />
    </main>
  );
}