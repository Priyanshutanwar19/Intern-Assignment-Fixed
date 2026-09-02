# Bugs found

Add one section per issue. Bug 1 is filled in to show the format — fix it then write what you changed. Copy the blank template for the rest.

Keep this file in the repo and **commit it** with your fixes.

---

## Bug 1

**How to reproduce:** Open the app. The expense list says “Newest first”. The first row is Wine (7 Mar). Board game (15 Mar) is further down.

**What is wrong:** The list is showing oldest expenses first. Also `dateValue()` in `format.js` was returning strings directly, causing string subtraction in `sort()` to evaluate to `NaN`.

**What I changed:** Updated `dateValue()` in `src/lib/format.js` to return numeric timestamps (`new Date(date).getTime()`), and updated `src/components/ExpenseList.jsx` to sort descending by date (`b - a`).

---

## Bug 2

**How to reproduce:** Check the Balances panel for members who paid for expenses (like Ben or Diya). The panel displays "owes $..." next to their name instead of "is owed $...".

**What is wrong:** The positive and negative balance conditions in `BalancesPanel.jsx` were inverted. Positive balances mean the person paid more than their share and should be owed money, while negative balances mean they owe money.

**What I changed:** Fixed the condition in `src/components/BalancesPanel.jsx` so positive balances display "is owed" with green styling and negative balances display "owes" with red styling.

---

## Bug 3

**How to reproduce:** Look at the "Uber to airport" expense ($60) paid by Diya for Aisha and Ben. Diya's balance is docked $30 even though she was not in the split list.

**What is wrong:** `computeBalances` in `src/lib/balances.js` had an extra check subtracting `amount / n` from the payer whenever the payer wasn't included in `splitWith`. A payer who isn't part of the split should be credited the full payment amount.

**What I changed:** Removed the extra deduction block in `src/lib/balances.js`.

---

## Bug 4

**How to reproduce:** When a debtor owes the exact amount a creditor is owed, no settlement payment is listed in the Settle up panel.

**What is wrong:** In `src/lib/settle.js`, the `else` branch of the settlement loop (where `d.amount === c.amount`) incremented the indices without adding the transfer to the `transfers` array.

**What I changed:** Added the transfer object into `transfers` before advancing `i` and `j` in `src/lib/settle.js`.

---

## Bug 5

**How to reproduce:** Select any member in the "Paid by" dropdown filter. The expenses list becomes empty even if that member paid for expenses.

**What is wrong:** In `src/App.jsx`, `e.paidBy` is a number (e.g. `1`) while `paidBy` from the select element is a string (`"1"`). The strict inequality check `e.paidBy !== paidBy` evaluates to true for all items.

**What I changed:** Updated the filter in `src/App.jsx` to compare string values (`String(e.paidBy) !== String(paidBy)`).

---

## Bug 6

**How to reproduce:** Apply a filter (e.g. category or search) or sort expenses, then delete an expense or edit its amount inline. A different expense in the list gets modified or deleted instead.

**What is wrong:** `ExpenseList.jsx` was passing the filtered/sorted index to the delete and update handlers, and `store.js` modified `state.expenses` by index rather than by unique expense ID.

**What I changed:** Updated `DELETE_EXPENSE` and `UPDATE_EXPENSE` actions in `src/state/store.js`, `src/App.jsx`, and `src/components/ExpenseList.jsx` to look up and update expenses by `id`.

---

## Bug 7

**How to reproduce:** Split an expense like $100 equally between 3 people. Each person gets $33.33, totaling $99.99 and losing 1 cent from the group total.

**What is wrong:** `splitEqual` and `splitByPercent` in `src/lib/money.js` rounded each person's share individually without distributing remainder cents, causing the total shares to not equal the expense amount. Also `percentsSumTo100` did a strict `=== 100` check which failed on floating point sums.

**What I changed:** Updated `splitEqual` and `splitByPercent` to distribute remainder cents so shares always sum to the exact total amount, and added floating-point tolerance to `percentsSumTo100`.

---

## Bug 8

**How to reproduce:** Add a new member using the "Add member" form. The member does not appear in the "Paid so far" summary section until an expense is added or modified.

**What is wrong:** In `src/components/SummaryCards.jsx`, the `useMemo` dependency array for `perPerson` was `[expenses]`, omitting `members`.

**What I changed:** Added `members` to the `useMemo` dependency array in `src/components/SummaryCards.jsx`.
