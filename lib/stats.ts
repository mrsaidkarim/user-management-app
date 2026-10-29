import Decimal from "decimal.js";

export type StatsUser = {
  salary: string | Decimal;
  startDate: Date | string;
};

export type UserStats = {
  count: number;
  totalSalary: string;
  averageSalary: string;
  averageSeniority: {
    years: number;
    months: number;
  };
};

export function calculateUserStats(
  users: StatsUser[],
  now: Date = new Date(),
): UserStats {
  const count = users.length;

  const totalSalary = users.reduce(
    (total, user) => total.plus(user.salary),
    new Decimal(0),
  );

  const averageSalary =
    count === 0
      ? new Decimal(0)
      : totalSalary.div(count).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  const totalMonths = users.reduce((total, user) => {
    const startDate = new Date(user.startDate);

    let months =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      now.getMonth() -
      startDate.getMonth();

    if (now.getDate() < startDate.getDate()) {
      months--;
    }

    return total + Math.max(0, months);
  }, 0);

  const averageMonths = count === 0 ? 0 : Math.floor(totalMonths / count);

  return {
    count,
    totalSalary: totalSalary.toFixed(2),
    averageSalary: averageSalary.toFixed(2),
    averageSeniority: {
      years: Math.floor(averageMonths / 12),
      months: averageMonths % 12,
    },
  };
}