import "dotenv/config";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const users = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin" as const,
    salary: "8500.00",
    startDate: "2022-03-15",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    role: "member" as const,
    salary: "6200.00",
    startDate: "2023-06-01",
  },
  {
    name: "Carol Williams",
    email: "carol@example.com",
    role: "member" as const,
    salary: "7100.50",
    startDate: "2021-11-10",
  },
  {
    name: "David Brown",
    email: "david@example.com",
    role: "admin" as const,
    salary: "9500.00",
    startDate: "2020-01-20",
  },
  {
    name: "Emma Davis",
    email: "emma@example.com",
    role: "member" as const,
    salary: "5800.00",
    startDate: "2024-02-12",
  },
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        salary: new Prisma.Decimal(user.salary),
        startDate: new Date(`${user.startDate}T00:00:00.000Z`),
      },
    });
  }

  console.log(`Seeded ${users.length} sample users.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed users:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });