# Week 07 — Lab report

**Name: Dauren**
**Group: Monday 16:00-19:00**
**Date:2026-11-05**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | week-06 |
| Bolt project link (or `not shared`, and why) | https://bolt.new/p/72154936 |
| Assistant that generated the tests (tool) | Gemini |
| Exact model (with its version, or `not displayed`) | Gemini 3.6 Flash |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN v…` line of a run) | 2.1.9 |
| Test command | npm test |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `src/lib/availability.ts`, function `checkAvailability()` |
| Its inputs | selected `Room`, candidate `{ start, end }`, and current time in minutes |
| What it returned | `CheckResult` with an `available` / `unavailable` decision and validation reasons |
| How the page used it | `src/App.tsx` called it from `handleCheck()` and passed the result to `ResultPanel` |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->
I extracted the booking decision into `src/booking.ts` as `canBook({ start, end, now, blocked, bookings })`. The function returns only a Boolean and contains the same AC1–AC4 decision rules that were already used by the prototype. `src/App.tsx` now imports and calls `canBook` for the availability decision, while the existing `checkAvailability` function is still used to produce detailed validation messages. This keeps the visible behaviour unchanged while giving the tests one independent function to exercise.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The existing booking ends at 660 and the new request starts at 660, so they only touch at the endpoint and do not overlap. |
| T02 | 540–570 (starts now) | false | AC1 | The request starts exactly at `now = 540`, but AC1 requires the start time to be strictly after the current time. |
| T03 | 720–720 (zero duration) | false | AC1 | Start and end are equal, so the interval has zero duration and does not satisfy `start < end`. |
| T04 | 750–720 (reversed) | false | AC1 | The start is later than the end, so the interval is invalid because AC1 requires `start < end`. |
| T05 | 1380–1441 (past day end) | false | AC1 | The end time is 1441, which is outside the valid one-day range because AC1 allows at most 1440. |
| T06 | 720–840 (120 minutes) | true | AC2 | The duration is exactly 120 minutes, which AC2 explicitly permits. |
| T07 | 720–841 (121 minutes) | false | AC2 | The duration is 121 minutes, which exceeds the 120-minute maximum. |
| T08 | 570–600 (touching before) | true | AC4 | The request ends exactly when the existing booking starts at 600, so the intervals only touch and do not overlap. |
| T09 | 630–690 (partial overlap) | false | AC4 | The request starts inside the existing 600–660 booking and continues past it, so the intervals overlap. |
| T10 | 570–690 (contains booking) | false | AC4 | The request begins before the existing booking and ends after it, so it completely contains the existing interval and overlaps it. |
| T11 | 615–645 (inside booking) | false | AC4 | The whole request lies inside the existing 600–660 booking, so it overlaps. |
| T12 | 600–660 (identical interval) | false | AC4 | The request has exactly the same start and end as the existing booking, so the intervals fully overlap. |
| T13 | 660–720, blocked = true | false | AC3 | Even though the time itself would otherwise be valid, a blocked room must reject every request. |
| T14 | 630–690, bookings = [] | true | AC4 | With no existing bookings, there is no overlap, and the other booking rules are satisfied. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | The availability check must return a Boolean result without changing the original bookings array. |
| X1 | 1320–1440 | true | AC1, AC2 | The request ends exactly at the allowed day boundary of 1440 and lasts exactly 120 minutes, so it should be accepted. |
| X2 | 540–660, bookings = [] | false | AC1 | Even with no bookings, starting exactly at the current time is invalid because the start must be strictly after `now`. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

import { describe, expect, it } from 'vitest';
import { canBook, type BookingInterval, type CanBookInput } from './canBook'; // Adjust path if needed

// Fixed Default Fixtures
const DEFAULT_NOW = 540;
const DEFAULT_BLOCKED = false;
const createDefaultBookings = (): BookingInterval[] => [
  { start: 600, end: 660 },
];

function createInput(overrides: Partial<CanBookInput> = {}): CanBookInput {
  return {
    start: 660,
    end: 720,
    now: DEFAULT_NOW,
    blocked: DEFAULT_BLOCKED,
    bookings: createDefaultBookings(),
    ...overrides,
  };
}

describe('canBook domain function tests (AC1 - AC5)', () => {
  // --- AC1: Interval validation (0 <= start < end <= 1440 and start > now) ---
  describe('AC1: Candidate Interval Validation', () => {
    it('T02: rejects request starting exactly at current time (start = now)', () => {
      const input = createInput({ start: 540, end: 570 });
      expect(canBook(input)).toBe(false);
    });

    it('T03: rejects zero-duration interval (start === end)', () => {
      const input = createInput({ start: 720, end: 720 });
      expect(canBook(input)).toBe(false);
    });

    it('T04: rejects invalid interval where start > end', () => {
      const input = createInput({ start: 750, end: 720 });
      expect(canBook(input)).toBe(false);
    });

    it('T05: rejects request ending past day boundary (end > 1440)', () => {
      const input = createInput({ start: 1380, end: 1441 });
      expect(canBook(input)).toBe(false);
    });

    it('X1: accepts maximum valid interval ending at boundary (1440)', () => {
      const input = createInput({ start: 1320, end: 1440 });
      expect(canBook(input)).toBe(true);
    });

    it('X2: rejects start = now even with empty bookings list', () => {
      const input = createInput({ start: 540, end: 660, bookings: [] });
      expect(canBook(input)).toBe(false);
    });
  });

  // --- AC2: Maximum duration (<= 120 mins) ---
  describe('AC2: Booking Duration Limits', () => {
    it('T06: accepts booking of exactly 120 minutes', () => {
      const input = createInput({ start: 720, end: 840 });
      expect(canBook(input)).toBe(true);
    });

    it('T07: rejects booking exceeding 120 minutes (121 mins)', () => {
      const input = createInput({ start: 720, end: 841 });
      expect(canBook(input)).toBe(false);
    });
  });

  // --- AC3: Room blocked state ---
  describe('AC3: Blocked Room Handling', () => {
    it('T13: rejects request when room is blocked', () => {
      const input = createInput({ start: 660, end: 720, blocked: true });
      expect(canBook(input)).toBe(false);
    });
  });

  // --- AC4: Overlap checks & endpoint touching ---
  describe('AC4: Booking Overlap Rules', () => {
    it('T01: accepts candidate starting when existing booking ends (touches right endpoint)', () => {
      const input = createInput({ start: 660, end: 720 });
      expect(canBook(input)).toBe(true);
    });

    it('T08: accepts candidate ending when existing booking starts (touches left endpoint)', () => {
      const input = createInput({ start: 570, end: 600 });
      expect(canBook(input)).toBe(true);
    });

    it('T09: rejects partial overlap starting inside existing booking', () => {
      const input = createInput({ start: 630, end: 690 });
      expect(canBook(input)).toBe(false);
    });

    it('T10: rejects candidate that completely encompasses existing booking', () => {
      const input = createInput({ start: 570, end: 690 });
      expect(canBook(input)).toBe(false);
    });

    it('T11: rejects candidate completely inside existing booking', () => {
      const input = createInput({ start: 615, end: 645 });
      expect(canBook(input)).toBe(false);
    });

    it('T12: rejects exact matching interval with existing booking', () => {
      const input = createInput({ start: 600, end: 660 });
      expect(canBook(input)).toBe(false);
    });

    it('T14: accepts candidate when bookings array is empty', () => {
      const input = createInput({ start: 630, end: 690, bookings: [] });
      expect(canBook(input)).toBe(true);
    });
  });

  // --- AC5: Decision output & data immutability ---
  describe('AC5: Data Immutability & Pure Decision Output', () => {
    it('returns Boolean decision and leaves input data untouched', () => {
      const originalBookings: BookingInterval[] = [
        { start: 600, end: 660 },
      ];
      const frozenInputData = JSON.stringify(originalBookings);

      const input: CanBookInput = {
        start: 660,
        end: 720,
        now: DEFAULT_NOW,
        blocked: DEFAULT_BLOCKED,
        bookings: originalBookings,
      };

      const result = canBook(input);

      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
      expect(JSON.stringify(input.bookings)).toBe(frozenInputData);
      expect(input.bookings).toBe(originalBookings);
    });
  });
});
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
# Run unit tests using Vitest
npx vitest run canBook.test.ts

Acceptance Criteria Mapping TableAcceptance CriteriaTest Cases CoveredAC1 (Time range 0 <= start < end <= 1440 and start > now)T02, T03, T04, T05, X1, X2AC2 (Max duration $\le 120$ minutes)T06, T07, X1AC3 (Room blocked rule)T13AC4 (No overlap, endpoints allowed to touch)T01, T08, T09, T10, T11, T12, T14AC5 (Pure decision output without side effects)AC5 (Immutability check)AC6 (UI responsiveness & validation feedback)Unclear / UI Scope (See flags below)

Flagged Unclear Requirements
AC6 Scope (UI vs Pure Function): AC6 refers to UI responsive layout ("desktop and narrow/mobile width") and visual validation feedback. The pure function canBook() operates purely in domain logic and cannot test UI rendering. Component level tests (e.g., using @testing-library/react or Playwright/Cypress) are needed to cover AC6.

Negative Start Boundary Case (start < 0): The logic explicitly checks start < 0, but no test case was specified in the table for negative inputs (e.g., start = -10).
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes 

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | Import of `canBook` | The generated suite imports `./canBook`, but the real function used by the page is in `./booking`. This would prevent the tests from exercising the real module. | revise | The tests must import the real `canBook` used by the page; this affects verification of AC1–AC5. |
| 2 | AC5 immutability test | The test uses an Available request, saves the original bookings state, checks the Boolean result, and verifies that the bookings array was not changed. | accept | AC5 requires an unambiguous Boolean decision without modifying existing booking data. |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-07/app

❯ src/booking.test.ts (0)

FAIL  src/booking.test.ts [ src/booking.test.ts ]
Error: Failed to load url ./canBook (resolved id: ./canBook) in /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-07/app/src/booking.test.ts. Does the file exist?

Test Files  1 failed (1)
Tests  no tests
Start at  16:59:54
Duration  447ms (transform 28ms, setup 0ms, collect 0ms, tests 0ms, environment 0ms, prepare 198ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| Entire suite / no tests collected | Vitest could not load `./canBook`; the module does not exist at that path. | Checked the import path in `booking.test.ts` against the real module `src/booking.ts`. | Test repair | The generated test imports `./canBook`, but the real function is in `./booking`. The import in the working copy must be changed to `./booking`; `suites/first/` remains unchanged. |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

Actual first run:

RUN v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-07/app

> src/booking.test.ts (0)

FAIL src/booking.test.ts [ src/booking.test.ts ]
Error: Failed to load url ./canBook (resolved id: ./canBook) in /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-07/app/src/booking.test.ts. Does the file exist?

Test Files 1 failed (1)
Tests no tests
Duration 447ms (transform 28ms, setup 0ms, collect 0ms, tests 0ms, environment 0ms, prepare 198ms)


Answer:
### Diagnostic: Why the First Run Failed

The test suite failed during collection due to an import path error:

* **Failure:** `Error: Failed to load url ./canBook`
* **Cause:** The test imports `./canBook`, but the actual application file in your project is named `./booking` (or located at `./booking.ts`).
* **Fix:** Update the import statement in `booking.test.ts` to `import { canBook, type CanBookInput, type BookingInterval } from './booking';`.

---

### Test Suite Review & Gap Analysis

#### 1. Incorrect Expectations & Weak Assertions

* **Weak Assertion on AC5 (Immutability):**
* *Current State:* Evaluates `originalBookings` before and after `canBook()` is called.
* *Gap/Defect:* It only checks shallow modification of the `bookings` array reference itself. It misses array mutation functions like `.pop()`, `.shift()`, or in-place element mutation if the array elements are reassigned.
* *Improvement:* Deep-freeze the `bookings` array (`Object.freeze()`) and assert `Object.isFrozen(input.bookings)` to ensure the utility performs strictly read-only operations without side effects.


* **AC6 Scope Resolution:**
* *Requirement:* **AC6** requires UI responsiveness and user-understandable validation feedback.
* *Clarification:* Unit testing `canBook()` (a pure logic function) cannot verify AC6. AC6 must be flagged as out-of-scope for pure unit testing and routed to integration/component tests.



#### 2. Missing Boundary Cases

* **AC1 Lower Boundary ($start < 0$):**
* *Missing Case:* No test checks negative start times (e.g., `start: -1, end: 60`).
* *Defect Detected:* An implementation that checks `start <= now` without checking `start < 0` would allow negative timestamps.


* **AC1 Upper Day Boundary ($end = 1440$):**
* *Missing Case:* T05 tests `1441` (invalid), and X1 tests `1320–1440`. A minimal 1-minute slot ending at `1440` (e.g., `1439–1440`) verifies the exact boundary condition.


* **AC2 Upper Bound Exact Thresholds ($120$ vs $121$):**
* *Missing Case:* Adding a boundary test for 119 minutes (e.g., `720–839`) ensures strict adherence to the upper threshold limit $\le 120$.


* **AC4 Edge Boundary Cases (Multiple Bookings):**
* *Missing Case:* Testing against an array containing multiple existing bookings (e.g., `[{start: 600, end: 660}, {start: 700, end: 760}]`) to verify non-overlap across disjoint intervals.



---

### Refactored Test Suite (`src/booking.test.ts`)

```typescript
import { describe, expect, it } from 'vitest';
import { canBook, type CanBookInput, type BookingInterval } from './booking';

const DEFAULT_NOW = 540;

const createDefaultFixture = (): {
  now: number;
  blocked: boolean;
  bookings: BookingInterval[];
} => ({
  now: DEFAULT_NOW,
  blocked: false,
  bookings: [{ start: 600, end: 660 }],
});

describe('canBook Unit Tests', () => {
  // AC1: Accept candidate interval only when 0 <= start < end <= 1440 and start > now
  describe('AC1 - Valid Time Interval & Bounds', () => {
    it('rejects negative start time (start < 0)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: -1, end: 60 })).toBe(false);
    });

    it('T02: rejects request starting exactly at current time (540-570)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 540, end: 570 })).toBe(false);
    });

    it('T03: rejects zero-duration interval (720-720)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 720, end: 720 })).toBe(false);
    });

    it('T04: rejects inverted interval where start > end (750-720)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 750, end: 720 })).toBe(false);
    });

    it('T05: rejects interval exceeding 1440 limit (1380-1441)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 1380, end: 1441 })).toBe(false);
    });

    it('X1: accepts interval up to exact upper boundary of 1440 (1320-1440)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 1320, end: 1440 })).toBe(true);
    });

    it('accepts exact 1-minute slot ending at 1440 limit (1439-1440)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 1439, end: 1440 })).toBe(true);
    });

    it('X2: rejects start == now even when bookings list is empty (540-660)', () => {
      const fixture = createDefaultFixture();
      expect(
        canBook({ ...fixture, start: 540, end: 660, bookings: [] })
      ).toBe(false);
    });
  });

  // AC2: Reject booking longer than 120 minutes
  describe('AC2 - Maximum Duration Limit', () => {
    it('accepts booking of 119 minutes (720-839)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 720, end: 839 })).toBe(true);
    });

    it('T06: accepts booking of exactly 120 minutes (720-840)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 720, end: 840 })).toBe(true);
    });

    it('T07: rejects booking exceeding 120 minutes (720-841)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 720, end: 841 })).toBe(false);
    });
  });

  // AC3: Reject request when room is blocked
  describe('AC3 - Blocked Room Status', () => {
    it('T13: rejects request on a blocked room (660-720)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 660, end: 720, blocked: true })).toBe(false);
    });
  });

  // AC4: Overlap rule (touching endpoints permitted)
  describe('AC4 - Booking Overlaps & Boundaries', () => {
    it('T01: accepts request touching endpoint after existing booking (660-720)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 660, end: 720 })).toBe(true);
    });

    it('T08: accepts request touching endpoint before existing booking (570-600)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 570, end: 600 })).toBe(true);
    });

    it('T09: rejects request overlapping end of existing booking (630-690)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 630, end: 690 })).toBe(false);
    });

    it('T10: rejects request completely encapsulating existing booking (570-690)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 570, end: 690 })).toBe(false);
    });

    it('T11: rejects request inside existing booking (615-645)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 615, end: 645 })).toBe(false);
    });

    it('T12: rejects request matching existing booking bounds exactly (600-660)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 600, end: 660 })).toBe(false);
    });

    it('T14: accepts request when no existing bookings exist (630-690)', () => {
      const fixture = createDefaultFixture();
      expect(canBook({ ...fixture, start: 630, end: 690, bookings: [] })).toBe(true);
    });

    it('accepts valid request fitting between two non-adjacent existing bookings', () => {
      const multipleBookings: BookingInterval[] = [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ];
      expect(
        canBook({
          now: DEFAULT_NOW,
          blocked: false,
          start: 660,
          end: 720,
          bookings: multipleBookings,
        })
      ).toBe(true);
    });
  });

  // AC5: Available/Unavailable decision without changing existing booking data
  describe('AC5 - Pure Function Decision & Immutability', () => {
    it('AC5: returns explicit boolean and leaves frozen input data untouched', () => {
      const originalBookings: BookingInterval[] = Object.freeze([
        Object.freeze({ start: 600, end: 660 }),
      ]) as unknown as BookingInterval[];

      const input: CanBookInput = {
        start: 660,
        end: 720,
        now: DEFAULT_NOW,
        blocked: false,
        bookings: originalBookings,
      };

      const result = canBook(input);

      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
      expect(input.bookings).toHaveLength(1);
      expect(input.bookings[0]).toEqual({ start: 600, end: 660 });
    });
  });
});

```

---

### Command to Run Tests

```bash
npx vitest run src/booking.test.ts

```
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-07/app

✓ src/booking.test.ts (21)
  ✓ canBook Unit Tests (21)
    ✓ AC1 - Valid Time Interval & Bounds (8)
    ✓ AC2 - Maximum Duration Limit (3)
    ✓ AC3 - Blocked Room Status (1)
    ✓ AC4 - Booking Overlaps & Boundaries (8)
    ✓ AC5 - Pure Function Decision & Immutability (1)

Test Files  1 passed (1)
Tests       21 passed (21)
Start at    17:15:59
Duration    557ms (transform 40ms, setup 0ms, collect 29ms, tests 5ms, environment 0ms, prepare 79ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration `>= 120` instead of `> 120` | Detected | T06, X1 | — |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08 | — |
| M3 | Remove the blocked-room rejection | Detected | T13 | — |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
FAIL src/booking.test.ts > canBook Unit Tests > AC1 - Valid Time Interval & Bounds > X1: accepts interval up to exact upper boundary of 1440 (1320-1440)

FAIL src/booking.test.ts > canBook Unit Tests > AC2 - Maximum Duration Limit > T06: accepts booking of exactly 120 minutes (720-840)

Test Files  1 failed (1)
Tests       2 failed | 19 passed (21)

FAIL src/booking.test.ts > canBook Unit Tests > AC4 - Booking Overlaps & Boundaries > T01: accepts request touching endpoint after existing booking (660-720)

FAIL src/booking.test.ts > canBook Unit Tests > AC4 - Booking Overlaps & Boundaries > T08: accepts request touching endpoint before existing booking (570-600)

Test Files  1 failed (1)
Tests       4 failed | 17 passed (21)

FAIL src/booking.test.ts > canBook Unit Tests > AC3 - Blocked Room Status > T13: rejects request on a blocked room (660-720)

Test Files  1 failed (1)
Tests       1 failed | 20 passed (21)
```

All three changes reverted, and the full suite run again (section 6.3): yes 

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | The page showed Available for Beacon 204 from 11:00 to 12:00 while the existing 10:00–11:00 booking remained visible. | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | The page showed Unavailable for the blocked Cedar Lab and displayed a clear blocked-room reason. | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | After clearing the Start field and checking availability, the page displayed: "Please enter all times in HH:MM (24-hour) format." | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At about 375 px width, the form, time controls, buttons, validation message, and room information remained readable and usable without overlap. | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Repeating the availability check again produced Available, and the existing 10:00–11:00 booking remained unchanged in the room schedule. | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| R1 | The real first Vitest run failed during test collection because `./canBook` could not be imported. Vitest printed `Tests no tests`, while the provided checker only recognizes numeric summaries such as `Tests ... (17)`. The original terminal output is kept unedited. |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 0 executed; suite failed during collection because of the wrong `./canBook` import | 21 executed, 21 passed, 0 failed |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC5 were represented, but the wrong import prevented any test from running; AC6 was correctly outside unit-test scope | AC1–AC5 covered with exact assertions; AC6 verified separately through manual UI checks |
| Selected mutants detected | Not run because the suite could not load | M1, M2 and M3 all detected |
| Accepted / revised / rejected tests | AC5 approach accepted; import path required revision | Correct expectations retained; import repaired; additional boundary and multiple-booking coverage added |
| Remaining limitations | Could not execute the real function because the generated import path was wrong | Invalid existing booking data is not defined by the ACs; UI behavior still requires manual checks |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

Calling `canBook` with `bookings = [{ start: 700, end: 650 }]`, request `660–720`, `now = 540`, and `blocked = false` returned `true`.
None of AC1–AC6 defines how invalid existing booking data should be handled. The acceptance criteria validate the candidate request, but they do not require validation of the stored bookings. Therefore this result is an implementation assumption rather than a requirement-defined behavior.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
The first suite had a serious setup mistake: it imported `canBook` from `./canBook`, while the real file in the project was `./booking.ts`. Because of this, Vitest could not even collect the tests. I found the problem from the first real test run and classified it as a test repair, not an implementation defect. After fixing the import and reviewing the suite, the final run passed all 21 tests.

The green run shows that the final `canBook` implementation satisfies the tested cases for AC1–AC5 and that the suite can detect the three deliberate defects. For example, M1 was detected by T06 and X1, while M3 was detected by T13. However, a green unit-test run does not prove that the user interface is correct, so AC6 still required manual browser checks.

One remaining limitation is invalid existing booking data. The ACs do not define what should happen when an existing booking has reversed times, so that behavior remains an implementation assumption rather than a verified requirement.