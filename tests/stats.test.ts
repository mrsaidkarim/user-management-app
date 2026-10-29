import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateUserStats } from "../lib/stats";

test("calculates total salary and average with half-up rounding", () => {
  const stats = calculateUserStats(
    [
      { salary: "10.00", startDate: "2024-01-01" },
      { salary: "10.01", startDate: "2024-01-01" },
    ],
    new Date("2026-01-01"),
  );

  assert.equal(stats.count, 2);
  assert.equal(stats.totalSalary, "20.01");
  assert.equal(stats.averageSalary, "10.01");
});

test("returns zero statistics for an empty list", () => {
  const stats = calculateUserStats([], new Date("2026-01-01"));

  assert.equal(stats.count, 0);
  assert.equal(stats.totalSalary, "0.00");
  assert.equal(stats.averageSalary, "0.00");
  assert.deepEqual(stats.averageSeniority, { years: 0, months: 0 });
});

test("calculates average seniority in years and months", () => {
  const stats = calculateUserStats(
    [
      { salary: "1000.00", startDate: "2024-01-01" },
      { salary: "1000.00", startDate: "2025-01-01" },
    ],
    new Date("2026-01-01"),
  );

  assert.deepEqual(stats.averageSeniority, { years: 1, months: 6 });
});