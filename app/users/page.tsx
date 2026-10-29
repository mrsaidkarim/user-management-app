
import Link from "next/link";
import { getUsers } from "@/lib/services/users";
import { usersQuerySchema } from "@/lib/validators/users-query";
import { Pagination } from "@/components/pagination";
import { UserFilters } from "@/components/user-filters";

type UsersPageProps = {
  searchParams: Promise<{
    page?: string;
    size?: string;
    role?: string;
    search?: string;
  }>;
};

export default async function UsersPage({
  searchParams,
}: UsersPageProps) {
  const params = await searchParams;

  const query = usersQuerySchema.parse({
    page: params.page,
    size: params.size,
    role: params.role,
    search: params.search,
  });

  const result = await getUsers(query);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <Link href="/" className="text-sm underline">
        Back home
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Users</h1>
	  <UserFilters
		initialSearch={query.search ?? ""}
		initialRole={query.role ?? ""}
		/>
      <p className="mt-2 text-gray-600">
        Total matching users: {result.total}
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Salary</th>
              <th className="p-3">Start date</th>
            </tr>
          </thead>
          <tbody>
            {result.users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.salary.toString()}</td>
                <td className="p-3">
                  {user.startDate.toISOString().slice(0, 10)}
                </td>
              </tr>
            ))}

            {result.users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-3 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
		page={result.page}
		totalPages={result.totalPages}
		size={result.size}
		/>
    </main>
  );
}
