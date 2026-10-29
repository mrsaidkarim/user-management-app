
import { getUserById } from "@/lib/services/users";
import { Prisma } from "@prisma/client";
import { updateUser } from "@/lib/services/users";
import { updateUserSchema } from "@/lib/validators/user";
import { deleteUser } from "@/lib/services/users";

type UserRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: UserRouteContext,
) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return Response.json(
      { error: "User not found" },
      { status: 404 },
    );
  }

  return Response.json({
    ...user,
    salary: user.salary.toString(),
    startDate: user.startDate.toISOString().slice(0, 10),
    createdAt: user.createdAt.toISOString(),
  });
}


export async function PATCH(
  request: Request,
  { params }: UserRouteContext,
) {
  const { id } = await params;
  const body: unknown = await request.json().catch(() => null);
  const validation = updateUserSchema.safeParse(body);

  if (!validation.success) {
    return Response.json(
      {
        error: "Invalid user data",
        details: validation.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const user = await updateUser(id, validation.data);

    return Response.json({
      ...user,
      salary: user.salary.toString(),
      startDate: user.startDate.toISOString().slice(0, 10),
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      if (error.code === "P2002") {
        return Response.json(
          { error: "A user with this email already exists" },
          { status: 409 },
        );
      }
    }

    throw error;
  }
}

export async function DELETE(
  _request: Request,
  { params }: UserRouteContext,
) {
  const { id } = await params;

  try {
    await deleteUser(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    throw error;
  }
}