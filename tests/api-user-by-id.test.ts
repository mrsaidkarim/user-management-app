
import "dotenv/config";
import { after, test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { DELETE, GET, PATCH } from "../app/api/users/[id]/route";
import { prisma } from "../lib/prisma";

const email = `api-user-id-${Date.now()}@example.com`;

after(async () => {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
});

test("GET /api/users/[id] returns a user or 404", async () => {
  const user = await prisma.user.create({
    data: {
      name: "API Test User",
      email,
      role: "member",
      salary: "2500.75",
      startDate: new Date("2024-01-15T00:00:00.000Z"),
    },
  });

  const foundResponse = await GET(
    new NextRequest(`http://localhost:3000/api/users/${user.id}`),
    { params: Promise.resolve({ id: user.id }) },
  );

  const foundBody = await foundResponse.json();

  assert.equal(foundResponse.status, 200);
  assert.equal(foundBody.id, user.id);
  assert.equal(foundBody.email, email);
  assert.equal(foundBody.salary, "2500.75");
  assert.equal(foundBody.startDate, "2024-01-15");

  const missingResponse = await GET(
    new NextRequest("http://localhost:3000/api/users/nonexistent-user-id"),
    { params: Promise.resolve({ id: "nonexistent-user-id" }) },
  );

  const missingBody = await missingResponse.json();

  assert.equal(missingResponse.status, 404);
  assert.equal(missingBody.error, "User not found");
});


test("PATCH /api/users/[id] updates fields and handles errors", async () => {
  const email = `api-patch-${Date.now()}@example.com`;

  const user = await prisma.user.create({
    data: {
      name: "Before Update",
      email,
      role: "member",
      salary: "2500.75",
      startDate: new Date("2024-01-15T00:00:00.000Z"),
    },
  });

  // Update only the name; other fields should remain unchanged.
  const response = await PATCH(
    new Request(`http://localhost:3000/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "After Update" }),
    }),
    { params: Promise.resolve({ id: user.id }) },
  );

  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.name, "After Update");
  assert.equal(body.email, email);
  assert.equal(body.salary, "2500.75");

  // Empty updates should be rejected.
  const invalidResponse = await PATCH(
    new Request(`http://localhost:3000/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }),
    { params: Promise.resolve({ id: user.id }) },
  );

  assert.equal(invalidResponse.status, 400);

  // Unknown user should return 404.
  const missingResponse = await PATCH(
    new Request("http://localhost:3000/api/users/nonexistent-user-id", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated Name" }),
    }),
    { params: Promise.resolve({ id: "nonexistent-user-id" }) },
  );

  assert.equal(missingResponse.status, 404);
});

test("DELETE /api/users/[id] deletes a user or returns 404", async () => {
  const email = `api-delete-${Date.now()}@example.com`;

  const user = await prisma.user.create({
    data: {
      name: "User to Delete",
      email,
      role: "member",
      salary: "2000.00",
      startDate: new Date("2024-01-15T00:00:00.000Z"),
    },
  });

  const response = await DELETE(
    new Request(`http://localhost:3000/api/users/${user.id}`, {
      method: "DELETE",
    }),
    { params: Promise.resolve({ id: user.id }) },
  );

  assert.equal(response.status, 204);

  const deletedUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  assert.equal(deletedUser, null);

  const missingResponse = await DELETE(
    new Request("http://localhost:3000/api/users/nonexistent-user-id", {
      method: "DELETE",
    }),
    { params: Promise.resolve({ id: "nonexistent-user-id" }) },
  );

  assert.equal(missingResponse.status, 404);
});