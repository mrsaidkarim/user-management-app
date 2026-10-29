
import { NextRequest } from "next/server";
import { getUsers } from "@/lib/services/users";
import { usersQuerySchema } from "@/lib/validators/users-query";

import { Prisma } from "@prisma/client";
import { userSchema } from "@/lib/validators/user";
import { createUser } from "@/lib/services/users";

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(
    request.nextUrl.searchParams.entries(),
  );

  const query = usersQuerySchema.parse(searchParams);
  const result = await getUsers(query);

  return Response.json({
    users: result.users.map((user) => ({
      ...user,
      salary: user.salary.toString(),
      startDate: user.startDate.toISOString().slice(0, 10),
      createdAt: user.createdAt.toISOString(),
    })),
    pagination: {
      page: result.page,
      size: result.size,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}



export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return Response.json(
      { error: "Invalid user data", details: validation.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const user = await createUser(validation.data);

    return Response.json(
      {
        ...user,
        salary: user.salary.toString(),
        startDate: user.startDate.toISOString().slice(0, 10),
        createdAt: user.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "A user with this email already exists" },
        { status: 409 },
      );
    }

    throw error;
  }
}