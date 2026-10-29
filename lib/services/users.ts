
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";

type GetUsersOptions = {
  page: number;
  size: number;
  role?: "admin" | "member";
  search?: string;
};

export async function getUsers({
  page,
  size,
  role,
  search,
}: GetUsersOptions) {
  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(search
      ? { name: { contains: search, mode: "insensitive" } }
      : {}),
  };

  const total = await prisma.user.count({ where });
  const pagination = paginate(total, page, size);

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (pagination.page - 1) * pagination.size,
    take: pagination.size,
  });

  return {
    users,
    ...pagination,
  };
}
