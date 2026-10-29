import { z } from "zod";

export const usersQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  size: z
    .union([z.literal("10"), z.literal("20"), z.literal("50")])
    .catch("10")
    .transform(Number),
  role: z.enum(["admin", "member"]).optional().catch(undefined),
  search: z.string().trim().optional().catch(undefined),
});

export type UsersQuery = z.infer<typeof usersQuerySchema>;