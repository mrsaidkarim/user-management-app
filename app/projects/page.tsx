import Link from "next/link";
import { paginate } from "@/lib/pagination";
import { Pagination } from "@/components/pagination";
import { backLink, card } from "@/lib/styles";

const projects = [
  { id: 1, name: "User Management App", status: "In progress" },
  { id: 2, name: "ft_transcendence", status: "Completed" },
  { id: 3, name: "RAG AI Assistant", status: "Completed" },
  { id: 4, name: "Minishell", status: "Completed" },
  { id: 5, name: "Cub3D", status: "Completed" },
  { id: 6, name: "Webserv", status: "In progress" },
  { id: 7, name: "Push Swap", status: "Completed" },
  { id: 8, name: "Philosophers", status: "Completed" },
  { id: 9, name: "So Long", status: "Completed" },
  { id: 10, name: "Born2beroot", status: "Completed" },
  { id: 11, name: "Libft", status: "Completed" },
  { id: 12, name: "Get Next Line", status: "Completed" },
];

type ProjectsPageProps = {
  searchParams: Promise<{ page?: string; size?: string }>;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const requestedPage = Number(params.page ?? 1);
  const requestedSize = Number(params.size ?? 10);

  const pagination = paginate(
    projects.length,
    requestedPage,
    requestedSize,
  );

  const startIndex = (pagination.page - 1) * pagination.size;
  const currentProjects = projects.slice(
    startIndex,
    startIndex + pagination.size,
  );

  return (
    <main className="space-y-6">
      <div>
        <Link href="/users" className={backLink}>
          ← Back to users
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-gray-500">
          Demonstration of reusable pagination.
        </p>
      </div>

      <div className={card}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentProjects.map((project) => (
                <tr key={project.id} className="transition hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {project.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        project.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                          : "bg-amber-50 text-amber-700 ring-amber-600/20"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`size-1.5 rounded-full ${
                          project.status === "Completed"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 p-4">
          <Pagination
            page={pagination.page}
            size={pagination.size}
            totalPages={pagination.totalPages}
          />
        </div>
      </div>
    </main>
  );
}
