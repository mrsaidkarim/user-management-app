"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userSchema } from "@/lib/validators/user";
import {
  buttonPrimary,
  buttonSecondary,
  card,
  inputBase,
  inputError,
  label,
} from "@/lib/styles";

type UserFormProps = {
  mode: "create" | "edit";
  userId?: string;
  initialValues?: {
    name: string;
    email: string;
    role: "admin" | "member";
    salary: string;
    startDate: string;
  };
};

export function UserForm({
  mode,
  userId,
  initialValues,
}: UserFormProps) {
  const router = useRouter();

  const [values, setValues] = useState({
    name: initialValues?.name ?? "",
    email: initialValues?.email ?? "",
    role: initialValues?.role ?? "member",
    salary: initialValues?.salary ?? "",
    startDate: initialValues?.startDate ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(field: keyof typeof values, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);

    // Validate the field the user just changed.
    const result = userSchema.shape[field].safeParse(value);

    setErrors((current) => ({
      ...current,
      [field]: result.success
        ? ""
        : result.error.issues[0]?.message ?? "Invalid value",
    }));

    setMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    // Validate the complete form before calling the API.
    const validation = userSchema.safeParse(values);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;

      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([field, messages]) => [
            field,
            messages?.[0] ?? "",
          ]),
        ),
      );
      return;
    }

    if (mode === "edit" && !userId) {
      setMessage("Missing user ID.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        mode === "create" ? "/api/users" : `/api/users/${userId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validation.data),
        },
      );

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        const fieldErrors = body?.details?.fieldErrors as
          | Record<string, string[]>
          | undefined;

        if (fieldErrors) {
          setErrors(
            Object.fromEntries(
              Object.entries(fieldErrors).map(([field, messages]) => [
                field,
                messages?.[0] ?? "",
              ]),
            ),
          );
        }

        setMessage(body?.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/users");
      router.refresh();
    } catch {
      setMessage("Could not connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function fieldClass(field: keyof typeof values) {
    return `${inputBase} ${errors[field] ? inputError : ""}`;
  }

  function fieldError(field: keyof typeof values) {
    return errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-sm text-red-600">
        {errors[field]}
      </p>
    ) : null;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={`${card} max-w-2xl`}>
      <div className="grid gap-5 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={label}>Name</label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Jane Doe"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass("name")}
            required
          />
          {fieldError("name")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className={label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="jane@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass("email")}
            required
          />
          {fieldError("email")}
        </div>

        <div>
          <label htmlFor="role" className={label}>Role</label>
          <select
            id="role"
            name="role"
            value={values.role}
            onChange={(event) => updateField("role", event.target.value)}
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? "role-error" : undefined}
            className={fieldClass("role")}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          {fieldError("role")}
        </div>

        <div>
          <label htmlFor="salary" className={label}>Salary</label>
          <input
            id="salary"
            name="salary"
            type="text"
            inputMode="decimal"
            value={values.salary}
            onChange={(event) => updateField("salary", event.target.value)}
            placeholder="50000.00"
            aria-invalid={Boolean(errors.salary)}
            aria-describedby={errors.salary ? "salary-error" : undefined}
            className={`${fieldClass("salary")} tabular-nums`}
            required
          />
          {fieldError("salary")}
        </div>

        <div>
          <label htmlFor="startDate" className={label}>Start date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={values.startDate}
            onChange={(event) => updateField("startDate", event.target.value)}
            aria-invalid={Boolean(errors.startDate)}
            aria-describedby={errors.startDate ? "startDate-error" : undefined}
            className={fieldClass("startDate")}
            required
          />
          {fieldError("startDate")}
        </div>
      </div>

      {message && (
        <div className="px-6 pb-4">
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {message}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 rounded-b-xl border-t border-gray-200 bg-gray-50 px-6 py-4">
        <Link href="/users" className={buttonSecondary}>
          Cancel
        </Link>
        <button type="submit" disabled={saving} className={buttonPrimary}>
          {saving
            ? "Saving..."
            : mode === "create"
              ? "Create user"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}
