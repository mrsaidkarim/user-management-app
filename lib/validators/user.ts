
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address"),
  role: z.enum(["admin", "member"]).default("member"),
  salary: z
  .string()
  .trim()
  .regex(/^\d+(\.\d+)?$/, "Salary must be a valid decimal")
  .refine(
    (value) => value.length <= 30,
    "Salary is too large",
  ),
  startDate: z.iso.date("Start date must use YYYY-MM-DD format"),
});

export const updateUserSchema = userSchema
  .omit({ role: true })
  .partial()
  .extend({
    role: z.enum(["admin", "member"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UserInput = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
