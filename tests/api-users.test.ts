import "dotenv/config";
import { after, test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET, POST } from "../app/api/users/route";
import { prisma } from "../lib/prisma";

const testEmailPrefix = `api-test-${Date.now()}`;

after(async () => {
  await prisma.user.deleteMany({
    where: { email: { startsWith: testEmailPrefix } },
  });
  await prisma.$disconnect();
});

test("GET /api/users returns filtered users and pagination metadata", async () => {
  const searchTerm = `ApiTest${Date.now()}`;

  const admin = await prisma.user.create({
    data: {
      name: `${searchTerm} Admin`,
      email: `${testEmailPrefix}-admin@example.com`,
      role: "admin",
      salary: "2500.75",
      startDate: new Date("2024-01-15T00:00:00.000Z"),
    },
  });

  await prisma.user.create({
    data: {
      name: `${searchTerm} Member`,
      email: `${testEmailPrefix}-member@example.com`,
      role: "member",
      salary: "1800.00",
      startDate: new Date("2025-02-01T00:00:00.000Z"),
    },
  });

  const request = new NextRequest(
    `http://localhost:3000/api/users?search=${searchTerm}&role=admin&page=1&size=10`,
  );

  const response = await GET(request);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.pagination.page, 1);
  assert.equal(body.pagination.size, 10);
  assert.equal(body.pagination.total, 1);
  assert.equal(body.pagination.totalPages, 1);

  assert.equal(body.users.length, 1);
  assert.equal(body.users[0].id, admin.id);
  assert.equal(body.users[0].role, "admin");
  assert.equal(body.users[0].salary, "2500.75");
  assert.equal(body.users[0].startDate, "2024-01-15");
});


test("POST /api/users creates a user, validates input, and rejects duplicate emails", async () => {
  const email = `${testEmailPrefix}-create@example.com`;

  const payload = {
    name: "Created API User",
    email,
    role: "member",
    salary: "2500.75",
    startDate: "2024-01-15",
  };

  // Successful creation
  const createdResponse = await POST(
    new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );

  const createdBody = await createdResponse.json();

  assert.equal(createdResponse.status, 201);
  assert.equal(createdBody.email, email);
  assert.equal(createdBody.salary, "2500.75");

  // Invalid input
  const invalidResponse = await POST(
    new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, email: "not-an-email" }),
    }),
  );

  assert.equal(invalidResponse.status, 400);

  // Duplicate email
  const duplicateResponse = await POST(
    new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );

  assert.equal(duplicateResponse.status, 409);
});