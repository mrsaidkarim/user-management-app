import Link from "next/link";
import { getUsers } from "@/lib/services/users";
import { usersQuerySchema } from "@/lib/validators/users-query";
import { Pagination } from "@/components/pagination";
import { UserFilters } from "@/components/user-filters";
import { DeleteUserButton } from "@/components/delete-user-button";
import { getUsersForStats } from "@/lib/services/users";
import { calculateUserStats } from "@/lib/stats";
import { buttonPrimary, card, formatAmount } from "@/lib/styles";

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

  const statsUsers = await getUsersForStats({
    role: query.role,
    search: query.search,
  });

  const stats = calculateUserStats(statsUsers);

  const statCards = [
    { label: "Total users", value: String(stats.count) },
    { label: "Total salary", value: formatAmount(stats.totalSalary) },
    { label: "Average salary", value: formatAmount(stats.averageSalary) },
    {
      label: "Average seniority",
      value: `${stats.averageSeniority.years}y ${stats.averageSeniority.months}m`,
    },
  ];

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your users and their information.
          </p>
        </div>

        <Link href="/users/new" className={buttonPrimary}>
          <span aria-hidden>+</span> Add user
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className={`${card} p-5`}>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className={card}>
        <div className="border-b border-gray-200 p-4">
          <UserFilters
            initialSearch={query.search ?? ""}
            initialRole={query.role ?? ""}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Salary</th>
                <th className="px-4 py-3">Start date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {result.users.map((user) => (
                <tr key={user.id} className="transition hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-50 text-xs font-semibold text-teal-800">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${
                        user.role === "admin"
                          ? "bg-violet-50 text-violet-700 ring-violet-600/20"
                          : "bg-gray-50 text-gray-600 ring-gray-500/20"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatAmount(user.salary.toString())}
                  </td>
                  <td className="px-4 py-3 text-gray-600 tabular-nums">
                    {user.startDate.toISOString().slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start justify-end gap-1">
                      <Link
                        href={`/users/${user.id}/edit`}
                        className="rounded-md px-2.5 py-1 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
                      >
                        Edit
                      </Link>
                      <DeleteUserButton userId={user.id} userName={user.name} />
                    </div>
                  </td>
                </tr>
              ))}

              {result.users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <p className="font-medium text-gray-900">No users found</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try a different search or role filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 p-4">
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            size={result.size}
          />
        </div>
      </div>
    </main>
  );
}
