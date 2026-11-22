# Week 10 — Lab report

**Name: Dauren**
**Group: Monday 16:00-19:00**
**Date:2026-11-17**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Gemini |
| Exact model (with its version, or `not displayed`) | Gemini 3.6 Flash |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | chat with pasted files |
| Starting point (`week-08` or `week-07`) | week-08 |
| Baseline commit — the checkpoint of Part 0 | 654d43c |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | Baseline suite passed: 23 tests in `src/booking.test.ts`. |
| `npm test` | yes | pass | `test` script runs `vitest run`; 23/23 tests passed. |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | `package.json` has no `test:unit` script. |
| `npm run build` | yes | pass | Vite production build completed successfully. |
| `npm run lint` | yes | fail | ESLint reported 3 unused-variable errors in `src/App.tsx` and `src/booking.ts`. |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
 RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-10/app

       ✓ X1: accepts interval up to exact upper boundary of 1440 (1320-1440)
       ✓ accepts exact 1-minute slot ending at 1440 limit (1439-1440)
       ✓ X2: rejects start == now even when bookings list is empty (540-660)
 ✓ src/booking.test.ts (23)
   ✓ canBook Unit Tests (21)
     ✓ AC1 - Valid Time Interval & Bounds (8)
       ✓ rejects negative start time (start < 0)
       ✓ T02: rejects request starting exactly at current time (540-570)
       ✓ T03: rejects zero-duration interval (720-720)
       ✓ T04: rejects inverted interval where start > end (750-720)
       ✓ T05: rejects interval exceeding 1440 limit (1380-1441)
       ✓ X1: accepts interval up to exact upper boundary of 1440 (1320-1440)
       ✓ accepts exact 1-minute slot ending at 1440 limit (1439-1440)
       ✓ X2: rejects start == now even when bookings list is empty (540-660)
     ✓ AC2 - Maximum Duration Limit (3)
       ✓ accepts booking of 119 minutes (720-839)
       ✓ T06: accepts booking of exactly 120 minutes (720-840)
       ✓ T07: rejects booking exceeding 120 minutes (720-841)
     ✓ AC3 - Blocked Room Status (1)
       ✓ T13: rejects request on a blocked room (660-720)
     ✓ AC4 - Booking Overlaps & Boundaries (8)
       ✓ T01: accepts request touching endpoint after existing booking (660-720)
       ✓ T08: accepts request touching endpoint before existing booking (570-600)
       ✓ T09: rejects request overlapping end of existing booking (630-690)
       ✓ T10: rejects request completely encapsulating existing booking (570-690)
       ✓ T11: rejects request inside existing booking (615-645)
       ✓ T12: rejects request matching existing booking bounds exactly (600-660)
       ✓ T14: accepts request when no existing bookings exist (630-690)
       ✓ accepts valid request fitting between two non-adjacent existing bookings
     ✓ AC5 - Pure Function Decision & Immutability (1)
       ✓ AC5: returns explicit boolean and leaves frozen input data untouched
   ✓ Week 08 regression tests (2)
     ✓ BUG-A: accepts request touching bookings on both sides
     ✓ BUG-B: available request does not mutate bookings

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  18:55:59
   Duration  719ms (transform 83ms, setup 0ms, collect 69ms, tests 5ms, environment 1ms, prepare 138ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
Based on the provided `AGENTS.md` file, here is the summary of the project constraints and exact commands:

### Project Constraints

* **Core Functionality & Rules:**
* **AC1:** Reject start time $\ge$ end time and any requests in the past.
* **AC2:** Enforce a maximum allowed booking duration of **120 minutes**.
* **AC3:** Reject requests for blocked rooms.
* **AC4:** Reject overlapping times. Requests touching an existing booking at an endpoint also count as an overlap.
* **AC5:** Return `Available` / `Unavailable` state **without mutating** existing booking data.


* **Domain Realism:** Use real room names and the real timetable from the KBTU portal.
* **Scope & Permissions:**
* Allowed to edit any file in the project.
* Allowed to add NPM packages as required.
* If persistence is needed, add a small Supabase table and login page.


* **Completion Workflow:** Ensure the page loads, the build passes, and publish a preview using Netlify.

---

### Exact Test Commands

* **Unit Tests:** `npm run test:unit`

---

### Other Project Commands Found

* **Install Dependencies:** `npm install`
* **Run Dev Server:** `npm run dev`
* **Build Project:** `npm run build`
* **Deploy Preview:** `npx netlify deploy --prod`
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->
Several rules in the summary are wrong for this project because they repeat the intentionally incorrect parts of `AGENTS.md`.

1. The instruction to use real room names and the real KBTU timetable is wrong. The Week 10 scope requires one fictional room and fictional data, with no real personal information.
2. AC4 is summarized incorrectly. The playbook says that touching an existing booking at an endpoint counts as an overlap, but the real acceptance contract says touching endpoints must be allowed.
3. AC6 is missing completely. The real contract also requires clear UI feedback on desktop and mobile.
4. The listed test command `npm run test:unit` is wrong for the current project because `package.json` has no `test:unit` script. I verified this by running it and receiving `Missing script: "test:unit"`.
5. The instruction that an agent may add a Supabase table and a login page conflicts with the project scope, which explicitly requires no login and no database.
6. The Netlify production deployment command conflicts with the Week 10 constraint that no external deployments are allowed.
7. The statement that packages may be added whenever needed is too broad for this lab. The later refactor task explicitly says not to add new dependencies.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->
The review ran in a fresh Gemini 3.6 Flash chat with the relevant project files uploaded to the chat. Gemini had no terminal or repository write access, so it could only inspect the supplied files. I did not ask it to make changes.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
Here is a security, correctness, reliability, maintainability, and agent-operations review based on inspection of the codebase without modifying files.

---

# 1. Correctness Risks

# Risk C-1: Divergence between `canBook` (decision logic) and `checkAvailability` (explanation generator)

* **Location:** `src/App.tsx` (`handleCheck`, lines 48–60) / `src/booking.ts` (`canBook`) / `src/lib/availability.ts` (`checkAvailability`)


* **Exact File/Function:** `App.tsx` lines 50–59.


* **Impact:** `App.tsx` calls `canBook` to determine the boolean decision (`"available"` or `"unavailable"`), but calls `checkAvailability` to obtain `reasons`. If `canBook` evaluates a request as unavailable while `checkAvailability` returns an empty `reasons` array (or vice versa), the UI displays `"unavailable"` without any user feedback explaining why, leading to silent UI state mismatch.


* **Verification:** Run a test case where `canBook` and `checkAvailability` disagree (e.g., passing `end = 1440` and `start = 1380`; `canBook` checks `end <= 1440`, whereas `checkAvailability` checks `end > 1440`).


* **Uncertainty:** Low. `checkAvailability` contains logic independent of `canBook`.



# Risk C-2: Domain non-compliance with AGENTS.md mandate (Real KBTU Timetable vs Fictional Sample Data)

* **Location:** `AGENTS.md` (lines 11–12) vs `src/data/rooms.ts` (lines 3–41)


* **Exact File/Function:** `src/data/rooms.ts` (`SAMPLE_ROOMS`).


* **Impact:** `AGENTS.md` explicitly specifies: *"For realism, use real room names and the real timetable from the KBTU portal."* However, `src/data/rooms.ts` relies on placeholder fictional data ("Aurora Hall", "Beacon 204") with generic 1-day schedules.


* **Verification:** Check `src/data/rooms.ts` against actual KBTU portal room names (e.g., 461, 444, Valikhanov Hall, Independence Hall) and timetables.
* **Uncertainty:** Low. `rooms.ts` contains an explicit comment: *"Fictional sample data only"*.



---

# 2. Reliability & Edge-Case Risks

# Risk R-1: Broken npm script execution for unit tests (`npm run test:unit`)

* **Location:** `package.json` (`scripts`, line 9) vs `AGENTS.md` (`Commands`, line 21)


* **Exact File/Function:** `package.json` line 9.


* **Impact:** `AGENTS.md` specifies `npm run test:unit` as the official test command. However, `package.json` maps `"test": "vitest run"` and has no `"test:unit"` script defined. Running `npm run test:unit` will fail with `npm ERR! missing script: test:unit`.


* **Verification:** Execute `npm run test:unit` in the terminal environment.
* **Uncertainty:** Zero. The script key `"test:unit"` is missing in `package.json`.



# Risk R-2: Lack of explicit upper-bound check on `start` in `canBook`

* **Location:** `src/booking.ts` (`canBook`, line 23)


* **Exact File/Function:** `canBook` line 23: `if (!(0 <= start && start < end && end <= 1440)) return false;`


* **Impact:** If `start = 1440` and `end = 1441`, the check fails at `end <= 1440`. However, for an interval like `start = 1440` and `end = 1440`, `start < end` fails first. While mathematically covered by `start < end && end <= 1440`, `start` itself is not explicitly constrained to `start < 1440`, which could cause unexpected edge case handling if bounds are extended.


* **Verification:** Run Vitest with input `{ start: 1440, end: 1441, now: 540, blocked: false, bookings: [] }`.


* **Uncertainty:** Low (currently safe due to `start < end` and `end <= 1440` conjunction).



---

# 3. Agent Operations & Maintainability Risks

# Risk A-1: Unchecked deployment step (`npx netlify deploy --prod`) without environment authentication

* **Location:** `AGENTS.md` (`Before you finish`, line 32)


* **Exact File/Function:** `AGENTS.md` line 32.


* **Impact:** Non-interactive CI/CD or automated agent runs executing `npx netlify deploy --prod` will hang or fail if Netlify CLI tokens or authentication context are not configured in the runner environment.
* **Verification:** Execute `npx netlify deploy --prod` in a non-interactive shell without `NETLIFY_AUTH_SITE` or `NETLIFY_AUTH_TOKEN`.
* **Uncertainty:** Medium (depends on environment secrets configuration).

# Risk A-2: Missing type checking in pre-build script workflow

* **Location:** `package.json` (`scripts`, lines 6–9)


* **Exact File/Function:** `package.json` script `"build"` (`vite build`).


* **Impact:** `vite build` does not perform TypeScript type checking by default (`tsc` is separated into `npm run typecheck`). An agent might pass `npm run build` even when type errors exist in modified files.


* **Verification:** Introduce a intentional TypeScript type error in `App.tsx` and execute `npm run build`.
* **Uncertainty:** Zero. Vite's default build ignores type checking unless `tsc` is explicitly chained.

---

# Summary Checklist of Missing Checks / Fixes Needed

1. **`package.json`**: Add `"test:unit": "vitest run"` script entry.


2. **`App.tsx` / `availability.ts**`: Align availability check decision source to rely directly on `canBook`.


3. **`data/rooms.ts`**: Populate actual KBTU campus rooms and portal timetable schedules.
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | `canBook` and `checkAvailability` are separate decision/explanation paths that may diverge | Correctness / Maintainability | `src/App.tsx`, `src/booking.ts`, `src/lib/availability.ts` using `grep -n "canBook\|checkAvailability"` | plausible | `App.tsx` calls both `canBook()` and `checkAvailability()`, so two independent logic paths exist. I confirmed the duplication, but I have not yet produced an input where their outputs actually disagree. |
| 2 | The fictional room data violates the project requirement to use real KBTU rooms | Privacy / Correctness | `src/data/rooms.ts` and `AGENTS.md` | unsupported | `rooms.ts` explicitly says "Fictional sample data only", which is correct for the real Week 10 contract. The incorrect requirement is in `AGENTS.md`, which wrongly asks for real KBTU room names and timetable data. |
| 3 | `npm run test:unit` is broken because the script does not exist | Reliability / Agent operations | `package.json` and a real `npm run test:unit` execution | confirmed | `package.json` contains `test: "vitest run"` but no `test:unit` script. Running `npm run test:unit` produced `Missing script: "test:unit"`. |
| 4 | `canBook` lacks a separate explicit upper-bound check for `start` | Correctness | `src/booking.ts` line with `0 <= start && start < end && end <= 1440` | unsupported | A separate `start <= 1440` check is unnecessary because a valid request must satisfy both `start < end` and `end <= 1440`. Therefore a valid `start` cannot exceed the day boundary. |
| 5 | `AGENTS.md` instructs an agent to deploy externally with Netlify | Agent operations / Security | `app/AGENTS.md`, line containing `npx netlify deploy --prod` | confirmed | The deployment command is present in `AGENTS.md`, while the Week 10 project constraints explicitly prohibit external deployments. An agent following the file could perform an unauthorized production action. |
| 6 | The build workflow does not perform TypeScript type checking | Maintainability / Reliability | `package.json` scripts | confirmed | `build` runs only `vite build`, while type checking is a separate `typecheck` script using `tsc --noEmit`. Therefore an agent running only the documented build command would not execute the project's explicit type-check command. |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Correctness | `minutesToLabel()` wraps 1440 to 0 → end-of-day is displayed as 00:00 → the UI can give misleading booking-time feedback | `src/lib/availability.ts minutesToLabel` | The function applies modulo 1440, so input 1440 becomes 0 even though AC1 permits end = 1440 | confirmed | 2 | 2 | 4 | Refactor time-label conversion so the valid end-of-day boundary is represented correctly without changing other valid times | Me | Add a Vitest regression test titled `R1 ...` that fails before the fix and passes afterwards |
| R2 | Agent operations | `AGENTS.md` names a nonexistent test command → an agent runs it → verification fails or the agent may incorrectly claim tests were checked | `AGENTS.md`, `package.json` | `npm run test:unit` returned `Missing script`, while package.json only defines `test` | confirmed | 3 | 2 | 6 | Patch AGENTS.md to use the real `npm test` command | Me | Run the command named in patched AGENTS.md and confirm it passes |
| R3 | Agent operations | Playbook permits production Netlify deployment → an agent follows it → an external deployment can occur without human approval | `AGENTS.md` | `npx netlify deploy --prod` is explicitly required in the current playbook | confirmed | 2 | 3 | 6 | Replace deployment instruction with an explicit prohibition on external deployment | Me | Inspect final AGENTS.md and checker C5 |
| R4 | Maintainability | Availability rules exist in both `canBook()` and `checkAvailability()` → one copy may change without the other → UI decision and explanation can diverge | `src/booking.ts`, `src/lib/availability.ts`, `src/App.tsx` | `App.tsx` calls both functions for one request and combines the boolean decision from one with reasons from the other | plausible | 2 | 2 | 4 | Reduce duplicated rule ownership through a small pure module while preserving the public interfaces and UI | Me | Run the whole suite and compare behavior before and after |
| R5 | Reliability | Existing lint errors remain in source → automated quality checks fail → an agent cannot establish a clean verification baseline | `src/App.tsx`, `src/booking.ts` | `npm run lint` reported 3 `no-unused-vars` errors | confirmed | 3 | 1 | 3 | Remove only the confirmed unused declarations without changing runtime behavior | Me | Run `npm run lint` and confirm zero errors |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R2 — broken test command in AGENTS.md (3 × 2 = 6).** This is confirmed because I ran `npm run test:unit` and npm reported that the script does not exist. The likelihood is 3 because an agent following AGENTS.md is explicitly instructed to run that command. The impact is 2 because verification fails, but it does not directly modify production data.
2. **R3 — external production deployment instruction (2 × 3 = 6).** This is confirmed by the `npx netlify deploy --prod` line in AGENTS.md. The likelihood is 2 because deployment still depends on authentication and environment access, but the impact is 3 because an automated agent could publish externally without the required human approval.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No Prettier configuration and no `prettier` dependency or script exist in `app/package.json`. |
| 1b | Linter | yes | `eslint.config.js` exists and `package.json` defines `"lint": "eslint ."`. |
| 1c | Type checks | yes | `tsconfig.json` / `tsconfig.app.json` exist, TypeScript is installed, and `package.json` defines `"typecheck": "tsc --noEmit -p tsconfig.app.json"`. |
| 1d | Unit tests | yes | `src/booking.test.ts` exists, Vitest is installed, and `"test": "vitest run"` is defined. |
| 1e | Pinned dependencies (lockfile) | yes | `app/package-lock.json` exists and is committed. |
| 2a | `.env.example` | no | No `app/.env.example` file exists. |
| 2b | Architecture notes | no | There is no README or project document inside `app/` describing module responsibilities. |
| 2c | `AGENTS.md` | yes | `app/AGENTS.md` exists, although the audit found incorrect rules that still need to be patched. |
| 3a | CI | no | There is no project `.github/workflows/` directory. The `.github` directories found are inside `node_modules` and are dependency files, not project CI. |
| 3b | Pre-commit hooks | no | No `.husky/`, `lint-staged`, `simple-git-hooks`, or `.pre-commit-config.yaml` exists in the project. |
| 3c | Integration checks | no | The current suite contains `src/booking.test.ts`, which tests the booking module directly; no page-level or multi-module integration test is present. |
| 3d | Reviewable evidence | no | There is no CI artifact, PR template, or other repository mechanism requiring test/build evidence for a change. |

### 5.2 The level and the gaps

**Level:** 1

**Missing evidence for the next level:**
- Row 2a: `.env.example` is missing. Even though this project should not use secrets, the readiness rubric requires the file for Level 2.
- Row 2b: architecture notes are missing. There is no README or document inside `app/` explaining the responsibilities of `App.tsx`, `booking.ts`, `lib/availability.ts`, and the other modules.
- Row 2c is present because `AGENTS.md` exists, but its current content is partly incorrect and will be patched in Task 6.
Level 1 is reached because four of its five rows are satisfied: linter, type checks, unit tests and a lockfile. The formatter row is missing. Level 2 is not reached because only one of its three rows currently passes.
The folder layout is understandable from the source structure, but the lack of architecture documentation means an agent has to infer module responsibilities from filenames and imports. The current `AGENTS.md` also contains inaccurate project rules, so its presence alone does not make the repository fully documented.
<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->


---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
### Missing & Conflicting Rules Analysis

Upon auditing `AGENTS.md` against `package.json` and the required project constraints (One fictional room, no login/database, preserve AC1–AC6, no secrets, no external deployments, test execution before acceptance), the following findings were identified:

1. **Conflicting Command (`AGENTS.md` line 18)**:


* `AGENTS.md` specifies `npm run test:unit`, but `package.json` defines `"test": "vitest run"`. Running `npm run test:unit` will fail with a missing script error.




2. **Conflicting Constraint & Directive (`AGENTS.md` line 22)**:


* `AGENTS.md` permits adding Supabase/login ("If bookings need to persist, add a small Supabase table and a login page"). This violates the constraints forbidding databases/login and external persistence.




3. **Conflicting Constraint & Directive (`AGENTS.md` line 26)**:


* `AGENTS.md` instructs agents to deploy externally (`npx netlify deploy --prod`), directly violating the "no external deployments" rule.




4. **Conflicting Context (`AGENTS.md` line 12)**:


* `AGENTS.md` references fetching real timetables/rooms from KBTU, conflicting with the single fictional room constraint.




5. **Missing Incomplete Acceptance Contract (AC6 missing)**:


* `AGENTS.md` only lists AC1–AC5, omitting AC6 ("Preserve clear UI feedback on desktop and mobile"). Additionally, AC4 in `AGENTS.md` states endpoint touching counts as an overlap, whereas project contract specifies allowing bookings touching only at endpoints.




6. **Missing Pre-acceptance Gate Rule**:
* `AGENTS.md` does not mandate running unit tests (`npm test`) before proposing acceptance.





---

### Draft Patch (`AGENTS.md`)

Below is the minimal proposed diff for `app/AGENTS.md`. It retains the exact heading structure and replaces only conflicting/missing lines without rewriting the document.

```diff
--- app/AGENTS.md
+++ app/AGENTS.md
@@ -9,12 +9,13 @@
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Work with one fictional room. Do not add databases, login systems, secrets, or external services.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add external persistence, login, or database services.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run all unit tests (`npm test`) and ensure they pass before proposing acceptance. Never deploy externally.

```

---

Please review the proposed patch above and let me know if you approve applying these changes to `app/AGENTS.md`.
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | `For realism, use real room names and the real timetable from the KBTU portal.` | Conflicts with the required scope of one fictional room and no real project data | approve | The Week 10 contract explicitly requires fictional room data, so this instruction must be corrected. |
| 2 | AC4 says endpoint touching counts as overlap | Conflicts with AC4, which requires touching endpoints to be allowed | approve | Existing tests already verify that touching bookings are valid, so the playbook must match the tested contract. |
| 3 | AC6 is missing | Missing requirement for clear desktop and mobile feedback | approve | AC6 is part of the required acceptance contract and must be present in the agent instructions. |
| 4 | Tests use `npm run test:unit` | Conflicts with `package.json`; that script does not exist | approve | I ran the command and received `Missing script: "test:unit"`. The real test command is `npm test`. |
| 5 | Supabase table and login page are allowed | Conflicts with the no-login and no-database scope | approve | Adding persistence or authentication would introduce features explicitly forbidden by the assignment. |
| 6 | `npx netlify deploy --prod` is required | Conflicts with the no-external-deployment rule and lacks a human approval gate | modify | I agree that deployment must be removed, but I will replace it with a rule to run the existing tests and build before proposing acceptance. |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..fc3910a 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,31 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.

-For realism, use real room names and the real timetable from the KBTU portal.
+Work with one fictional room. Do not add databases, login systems, secrets, or external services.

 ## Acceptance contract

 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.

 ## Commands

 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`

 ## You may

 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add external persistence, login, or database services.

 ## Before you finish

 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and `npm run build` before proposing acceptance; do not deploy externally.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R1**. The real run, with the new test failing:

```text
 RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-10/app

 ❯ src/booking.test.ts (24)
   ❯ Week 10 risk regression (1)
     × R1 AC6: displays the valid end-of-day boundary 1440 as 24:00

 FAIL  src/booking.test.ts > Week 10 risk regression > R1 AC6: displays the valid end-of-day boundary 1440 as 24:00
AssertionError: expected '00:00' to be '24:00' // Object.is equality

Expected: "24:00"
Received: "00:00"

 Test Files  1 failed (1)
      Tests  1 failed | 23 skipped (24)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1440 px | Form layout, result feedback, room schedule, no clipping or overlapping elements | pass | `evidence/ui-desktop.png` |
| Mobile | 390 px | Responsive stacking, readable controls and feedback, no horizontal overflow or overlapping elements | pass | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
- I did not run automated browser or end-to-end tests because this project does not include an E2E test setup.
- I did not test additional browsers; the manual UI check was performed in Chrome.

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:**
The problem was that time-label conversion lived inside the larger availability module and incorrectly wrapped the valid end-of-day boundary `1440` to `00:00`.
I used a small extracted pure module (`src/lib/time.ts`) rather than the Specification / Rule Engine pattern suggested by the assistant. This keeps time conversion isolated and testable, fixes the `24:00` boundary without changing the public UI imports, and avoids unnecessary architectural complexity.

**What I rejected from the agent's patch, and why:**
I rejected the proposed Specification / Rule Engine refactor because the confirmed R1 problem was only the time-label boundary and did not justify introducing a rule-engine abstraction. I kept the change minimal: extracted the pure time helpers and added the special case for `1440`.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/src/lib/availability.ts b/week-10/app/src/lib/availability.ts
index e14ad73..e45f25e 100644
--- a/week-10/app/src/lib/availability.ts
+++ b/week-10/app/src/lib/availability.ts
@@ -1,22 +1,17 @@
 import type { Booking, CheckResult, Interval, Room } from "@/types";
 
-export const MINUTES_PER_DAY = 1440;
-export const MAX_BOOKING_MINUTES = 120;
+import {
+  labelToMinutes,
+  minutesToLabel,
+  MINUTES_PER_DAY,
+} from "./time";
 
-/** minutes for a single day, with zero-padding. */
-export function minutesToLabel(minutes: number): string {
-  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
-  const h = Math.floor(m / 60);
-  const mm = m % 60;
-  return `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
-}
+export {
+  labelToMinutes,
+  minutesToLabel,
+  MINUTES_PER_DAY,
+} from "./time";
 
-/** "HH:MM" -> minutes from 00:00. Returns null when malformed. */
-export function labelToMinutes(label: string): number | null {
-  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(label.trim());
-  if (!match) return null;
-  return Number(match[1]) * 60 + Number(match[2]);
-}
 
 /** Two intervals overlap when each starts strictly before the other ends. */
 export function overlaps(a: Interval, b: Interval): boolean {
```

### 8.2 The second mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
```

**Problem → pattern → benefit:**
The problem was that `AGENTS.md` instructed an agent to run `npm run test:unit`, but that script does not exist in `package.json`.
No design pattern was needed. The mitigation was a minimal playbook correction from `npm run test:unit` to the real `npm test` command, so an agent can verify changes using an existing script.

**What I rejected from the agent's patch, and why:**
I did not accept any broader restructuring of the playbook. I kept the original headings and changed only the conflicting rules required by the assignment, because the checker requires a minimal patch.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..fc3910a 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,31 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Work with one fictional room. Do not add databases, login systems, secrets, or external services.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add external persistence, login, or database services.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and `npm run build` before proposing acceptance; do not deploy externally.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 2 | 2 | 4 | 1 | 2 | 2 | The R1 regression test now passes and the full suite passes 24/24. |
| R2 | 3 | 2 | 6 | 1 | 2 | 2 | `AGENTS.md` now uses the existing `npm test` command and checker A3 passes. |
| R3 | 2 | 3 | 6 | 1 | 2 | 2 | The production Netlify deployment instruction was removed and replaced with an explicit rule not to deploy externally; checker C5 passes. |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
 RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-10/app

 ✓ src/booking.test.ts (24)
   ✓ canBook Unit Tests (21)
     ✓ AC1 - Valid Time Interval & Bounds (8)
       ✓ rejects negative start time (start < 0)
       ✓ T02: rejects request starting exactly at current time (540-570)
       ✓ T03: rejects zero-duration interval (720-720)
       ✓ T04: rejects inverted interval where start > end (750-720)
       ✓ T05: rejects interval exceeding 1440 limit (1380-1441)
       ✓ X1: accepts interval up to exact upper boundary of 1440 (1320-1440)
       ✓ accepts exact 1-minute slot ending at 1440 limit (1439-1440)
       ✓ X2: rejects start == now even when bookings list is empty (540-660)
     ✓ AC2 - Maximum Duration Limit (3)
       ✓ accepts booking of 119 minutes (720-839)
       ✓ T06: accepts booking of exactly 120 minutes (720-840)
       ✓ T07: rejects booking exceeding 120 minutes (720-841)
     ✓ AC3 - Blocked Room Status (1)
       ✓ T13: rejects request on a blocked room (660-720)
     ✓ AC4 - Booking Overlaps & Boundaries (8)
       ✓ T01: accepts request touching endpoint after existing booking (660-720)
       ✓ T08: accepts request touching endpoint before existing booking (570-600)
       ✓ T09: rejects request overlapping end of existing booking (630-690)
       ✓ T10: rejects request completely encapsulating existing booking (570-690)
       ✓ T11: rejects request inside existing booking (615-645)
       ✓ T12: rejects request matching existing booking bounds exactly (600-660)
       ✓ T14: accepts request when no existing bookings exist (630-690)
       ✓ accepts valid request fitting between two non-adjacent existing bookings
     ✓ AC5 - Pure Function Decision & Immutability (1)
       ✓ AC5: returns explicit boolean and leaves frozen input data untouched
   ✓ Week 08 regression tests (2)
     ✓ BUG-A: accepts request touching bookings on both sides
     ✓ BUG-B: available request does not mutate bookings
   ✓ Week 10 risk regression (1)
     ✓ R1 AC6: displays the valid end-of-day boundary 1440 as 24:00

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  17:25:16
   Duration  527ms (transform 45ms, setup 0ms, collect 40ms, tests 5ms, environment 0ms, prepare 65ms)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | Project-specific requirement |
| --- | --- |
| Isolation | The background agent must work only on a separate branch or worktree created from the current `week-10` branch and must never modify `main` directly. |
| Permitted files | The agent may inspect the whole `app/` folder but may edit only files explicitly approved for the assigned task, such as `src/booking.ts`, `src/lib/availability.ts`, `src/lib/time.ts`, tests, or `AGENTS.md`. |
| Commands | The agent may run `npm install`, `npm test`, `npm run build`, `npm run typecheck`, and `npm run lint` inside `week-10/app`. It must record the real outputs. |
| Prohibited actions | The agent must not deploy externally, add login or database services, access or create secrets, edit `main`, force-push, delete unrelated files, or add dependencies without explicit approval. |
| Required evidence | Before proposing acceptance, the agent must provide the changed-file list, reviewed diff, full test output, build result, typecheck result, lint result, and a short note connecting every change to a registered risk. |
| Before merging or deploying | A human must review the diff, verify the evidence, confirm that AC1–AC6 are preserved, and explicitly approve the change. Deployment is prohibited for this project. |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | Final checker run has no remaining FAIL or ERROR checks. |

---

## 10. Release decision and conclusion

**Decision:** GO 

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
I chose GO because the two highest confirmed risks were reduced and the final functional verification is green. R2 originally scored 6 because `AGENTS.md` named a nonexistent test command, but the playbook now uses `npm test`, which exists and passes. R3 also scored 6 because the old instructions required an external Netlify production deployment; that instruction was removed and deployment is now explicitly forbidden.
R1 was confirmed by a failing regression test showing that the valid 1440-minute boundary was displayed as `00:00`. After the refactor, the same test passes and the full suite passes 24/24. R5 remains open because lint still reports three pre-existing unused-variable errors, but its score is 3 and it does not block release. Typecheck and production build both pass.