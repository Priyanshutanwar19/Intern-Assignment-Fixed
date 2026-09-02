export function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0.00";
  const fixed = Math.abs(n).toFixed(2);
  if (fixed === "0.00") return "$0.00";
  const sign = n < 0 ? "-" : "";
  return `${sign}$${fixed}`;
}

export function splitEqual(amount, ids) {
  const n = ids.length || 1;
  const totalCents = Math.round(Number(amount) * 100);
  const baseCents = Math.floor(totalCents / n);
  const remainder = totalCents % n;

  const shares = {};
  ids.forEach((id, index) => {
    const cents = baseCents + (index < remainder ? 1 : 0);
    shares[id] = cents / 100;
  });
  return shares;
}

export function percentsSumTo100(percents) {
  const values = Object.values(percents).map(Number);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.abs(sum - 100) < 0.01;
}

export function splitByPercent(amount, percents) {
  const total = Number(amount);
  const entries = Object.entries(percents);
  const shares = {};
  let allocated = 0;

  entries.forEach(([id, pct], index) => {
    if (index === entries.length - 1) {
      shares[id] = Number((total - allocated).toFixed(2));
    } else {
      const share = Number(((total * Number(pct)) / 100).toFixed(2));
      shares[id] = share;
      allocated += share;
    }
  });

  return shares;
}

export function sharesForExpense(expense) {
  if (expense.splitType === "percent" && expense.percents) {
    return splitByPercent(expense.amount, expense.percents);
  }
  return splitEqual(expense.amount, expense.splitWith);
}
