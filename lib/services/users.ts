
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import type { UpdateUserInput, UserInput } from "@/lib/validators/user";

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

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(input: UserInput) {
  return prisma.user.create({
    data: {
      ...input,
      salary: new Prisma.Decimal(input.salary),
      startDate: new Date(`${input.startDate}T00:00:00.000Z`),
    },
  });
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
) {
  return prisma.user.update({
    where: { id },
    data: {
      ...input,
      salary:
        input.salary === undefined
          ? undefined
          : new Prisma.Decimal(input.salary),
      startDate:
        input.startDate === undefined
          ? undefined
          : new Date(`${input.startDate}T00:00:00.000Z`),
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}

export async function getUsersForStats({
  role,
  search,
}: {
  role?: "admin" | "member";
  search?: string;
}) {
  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(search
      ? { name: { contains: search, mode: "insensitive" } }
      : {}),
  };

  return prisma.user.findMany({
    where,
    select: {
      salary: true,
      startDate: true,
    },
  });
}