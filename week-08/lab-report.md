# Week 08 — Lab report

**Name: Dauren**
**Group: Monday 16:00-19:00**
**Date: 2026-11-07**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| Assistant I debugged with (tool) | Gemini |
| Exact model (with its version, or `not displayed`) | Gemini 3.6 Flash |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | prompt-only simulation |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-08/app

✓ src/booking.test.ts (21)
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

Test Files  1 passed (1)
Tests       21 passed (21)
Start at    21:26:02
Duration    296ms (transform 20ms, setup 0ms, collect 16ms, tests 3ms, environment 0ms, prepare 31ms)
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text
RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-08/app

❯ src/booking.test.ts (21)

FAIL src/booking.test.ts > canBook Unit Tests > AC4 - Booking Overlaps & Boundaries > T01: accepts request touching endpoint after existing booking (660-720)

FAIL src/booking.test.ts > canBook Unit Tests > AC4 - Booking Overlaps & Boundaries > T08: accepts request touching endpoint before existing booking (570-600)

FAIL src/booking.test.ts > canBook Unit Tests > AC4 - Booking Overlaps & Boundaries > accepts valid request fitting between two non-adjacent existing bookings

FAIL src/booking.test.ts > canBook Unit Tests > AC5 - Pure Function Decision & Immutability > AC5: returns explicit boolean and leaves frozen input data untouched

Test Files  1 failed (1)
Tests       4 failed | 17 passed (21)
Start at    22:01:36
Duration    391ms
```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
FAIL src/booking.test.ts > Week 08 regression tests > BUG-A: accepts request touching bookings on both sides

FAIL src/booking.test.ts > Week 08 regression tests > BUG-B: available request does not mutate bookings

Test Files  1 failed (1)
Tests       6 failed | 17 passed (23)
Start at    22:06:31
Duration    198ms
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | BUG-A | request 660–720 with bookings 600–660 and 720–780 | true | false | The overlap condition uses `start <= b.end && end >= b.start`. The non-strict comparisons make endpoint touching count as overlap, although AC4 allows touching. |
| BUG-B | BUG-B | request 720–780 with booking 600–660 | true and bookings unchanged | true, but bookings changed from one item to two | The line `bookings.push({ start, end })` mutates the original bookings array after an Available request, which violates AC5. |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes |
| I read the whole file once: no passwords, API keys or private student data | yes |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
Archive:  skills/bug-detector.zip

  Length      Date    Time    Name
---------  ---------- -----   ----
        0  11-07-2026 22:08   bug-detector/
        0  10-31-2026 17:36   bug-detector/.gitkeep
      571  11-07-2026 22:19   bug-detector/SKILL.md
---------                     -------
      571                     3 files
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->
I used the prompt-only simulation because I did not install the skill through a dedicated skill-upload interface. I pasted the complete contents of `SKILL.md` into a fresh Gemini chat as the first message and clearly stated that it was a prompt-only simulation, not an installed skill. The chat then used that procedure for the debugging diagnosis.

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

Acceptance criteria:

AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output:

FAIL src/booking.test.ts > canBook Unit Tests > AC4 - Booking Overlaps & Boundaries > T01: accepts request touching endpoint after existing booking (660-720)

AssertionError: expected false to be true // Object.is equality

Expected:
true

Received:
false

The test uses:
start = 660
end = 720
now = 540
blocked = false
bookings = [{ start: 600, end: 660 }]

Provided canBook code:

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
### Root Cause

The test failure is caused by the overlap check condition inside the `for` loop:

```typescript
if (start <= b.end && end >= b.start) return false;

```

Using inclusive boundary checks (`<=` and `>=`) treats touching endpoints as an overlap. For a new booking `(660-720)` and an existing booking `(600-660)`:

* `start (660) <= b.end (660)` evaluates to `true`.
* `end (720) >= b.start (600)` evaluates to `true`.

Consequently, touching bookings trigger a rejection, violating **AC4** ("allow bookings that only touch at endpoints").

**Secondary Violation (AC5):**

Line 17 executes `bookings.push({ start, end })`. This mutates the input array during a availability check, violating **AC5** ("Return Available / Unavailable without changing booking data").

---

### Minimal Patch

Change the overlap comparison from inclusive bounds (`<=`, `>=`) to strict bounds (`<`, `>`), and remove the array mutation (`bookings.push(...)`).

```typescript
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}

```

---

### Regression Tests

Here are unit test cases covering endpoint touching (AC4) and immutability (AC5):

```typescript
import { describe, it, expect } from 'vitest';
import { canBook } from './booking';

describe('canBook Unit Tests - AC4 & AC5 Regression', () => {
  it('T01: accepts request touching endpoint after existing booking (660-720)', () => {
    const bookings = [{ start: 600, end: 660 }];
    const result = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });
    expect(result).toBe(true);
  });

  it('T02: accepts request touching endpoint before existing booking (540-600)', () => {
    const bookings = [{ start: 600, end: 660 }];
    const result = canBook({ start: 540, end: 600, now: 500, blocked: false, bookings });
    expect(result).toBe(true);
  });

  it('AC5: does not mutate the existing bookings array', () => {
    const bookings = [{ start: 600, end: 660 }];
    const originalLength = bookings.length;
    canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });
    expect(bookings.length).toBe(originalLength);
  });
});

```
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
Use the bug-detector skill to diagnose the failed room-booking test.

Acceptance criteria:

AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output:

FAIL src/booking.test.ts > canBook Unit Tests > AC4 - Booking Overlaps & Boundaries > T01: accepts request touching endpoint after existing booking (660-720)

AssertionError: expected false to be true // Object.is equality

Expected:
true

Received:
false

The test uses:
start = 660
end = 720
now = 540
blocked = false
bookings = [{ start: 600, end: 660 }]

Provided canBook code:

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
### Root Cause Analysis

Two distinct issues exist in the provided `canBook` implementation:

1. **AC4 Boundary Overlap Violation (Failing Test Cause):**
The overlap detection check uses non-strict inequality comparisons:
```typescript
if (start <= b.end && end >= b.start) return false;

```


For the test case where `bookings = [{ start: 600, end: 660 }]` and the requested booking is `start = 660, end = 720`:
* `start <= b.end` (660 <= 660) evaluates to **`true`**
* `end >= b.start` (720 >= 600) evaluates to **`true`**


Because both conditions evaluate to `true`, the function returns `false` (rejecting the booking). Per **AC4**, bookings that only touch at endpoints (where `start === b.end` or `end === b.start`) must be allowed. Two intervals $[A, B]$ and $[C, D]$ overlap if and only if $A < D$ and $B > C$.
2. **AC5 Data Mutation Violation:**
Line 17 modifies the input `bookings` array:
```typescript
bookings.push({ start, end });

```


This mutates caller state during a pure query check, violating **AC5** ("Return Available / Unavailable without changing booking data").

---

### Minimal Patch

Change the overlap check to strict inequalities (`<` and `>`) and remove the side-effect `bookings.push(...)`:

```typescript
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}

```

---

### Regression Tests

Here is a unit test suite verifying touching endpoints (AC4) and array immutability (AC5):

```typescript
import { describe, it, expect } from 'vitest';
import { canBook } from './booking';

describe('canBook Unit Tests - AC4 & AC5 Regression', () => {
  it('AC4 (T01): accepts request touching endpoint after existing booking (660-720)', () => {
    const bookings = [{ start: 600, end: 660 }];
    const result = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });
    expect(result).toBe(true);
  });

  it('AC4 (T02): accepts request touching endpoint before existing booking (540-600)', () => {
    const bookings = [{ start: 600, end: 660 }];
    const result = canBook({ start: 540, end: 600, now: 500, blocked: false, bookings });
    expect(result).toBe(true);
  });

  it('AC4 (T03): rejects actual overlapping request (630-690)', () => {
    const bookings = [{ start: 600, end: 660 }];
    const result = canBook({ start: 630, end: 690, now: 540, blocked: false, bookings });
    expect(result).toBe(false);
  });

  it('AC5: does not mutate the input bookings array', () => {
    const bookings = [{ start: 600, end: 660 }];
    const originalLength = bookings.length;
    canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });
    expect(bookings.length).toBe(originalLength);
  });
});

```
```

Did the environment show that the skill was invoked? not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Correct. It identified the non-strict overlap condition as BUG-A and also noticed the `bookings.push(...)` mutation as BUG-B. | Correct. It identified the same two defects and linked BUG-A to AC4 and BUG-B to AC5. |
| Reproducible test | Good. It proposed endpoint-touching tests and an immutability test. | Good. It proposed tests for touching endpoints, real overlap, and booking-array immutability. |
| Minimal proposed patch | Correct. It proposed changing the overlap comparison to strict bounds and removing `bookings.push(...)`. | Correct. It proposed the same minimal fixes without rewriting unrelated logic. |
| Unsupported claims | No important unsupported claims. The answer was consistent with the provided code and failing test. | No important unsupported claims. The answer stayed consistent with the code and separated the two defects clearly. |
| Clarity of explanation | Clear, but more direct and less structured around confirmed defects versus hypotheses. | Clearer structure. It separated the AC4 failure from the AC5 mutation and explained each root cause before proposing fixes. |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

- No skill: both BUG-A and BUG-B
- With skill: both BUG-A and BUG-B

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;

(base) daurenkaztay@Noutbuk-Dauren app % npx vitest run -t "BUG-A"


 RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-08/app

 ✓ src/booking.test.ts (23)
   ↓ canBook Unit Tests (21) [skipped]
     ↓ AC1 - Valid Time Interval & Bounds (8) [skipped]
       ↓ rejects negative start time (start < 0) [skipped]
       ↓ T02: rejects request starting exactly at current time (540-570) [skipped]
       ↓ T03: rejects zero-duration interval (720-720) [skipped]
       ↓ T04: rejects inverted interval where start > end (750-720) [skipped]
       ↓ T05: rejects interval exceeding 1440 limit (1380-1441) [skipped]
       ↓ X1: accepts interval up to exact upper boundary of 1440 (1320-1440) [skipped]
       ↓ accepts exact 1-minute slot ending at 1440 limit (1439-1440) [skipped]
       ↓ X2: rejects start == now even when bookings list is empty (540-660) [skipped]
     ↓ AC2 - Maximum Duration Limit (3) [skipped]
       ↓ accepts booking of 119 minutes (720-839) [skipped]
       ↓ T06: accepts booking of exactly 120 minutes (720-840) [skipped]
       ↓ T07: rejects booking exceeding 120 minutes (720-841) [skipped]
     ↓ AC3 - Blocked Room Status (1) [skipped]
       ↓ T13: rejects request on a blocked room (660-720) [skipped]
     ↓ AC4 - Booking Overlaps & Boundaries (8) [skipped]
       ↓ T01: accepts request touching endpoint after existing booking (660-720) [skipped]
       ↓ T08: accepts request touching endpoint before existing booking (570-600) [skipped]
       ↓ T09: rejects request overlapping end of existing booking (630-690) [skipped]
       ↓ T10: rejects request completely encapsulating existing booking (570-690) [skipped]
       ↓ T11: rejects request inside existing booking (615-645) [skipped]
       ↓ T12: rejects request matching existing booking bounds exactly (600-660) [skipped]
       ↓ T14: accepts request when no existing bookings exist (630-690) [skipped]
       ↓ accepts valid request fitting between two non-adjacent existing bookings [skipped]
     ↓ AC5 - Pure Function Decision & Immutability (1) [skipped]
       ↓ AC5: returns explicit boolean and leaves frozen input data untouched [skipped]
   ✓ Week 08 regression tests (2)
     ✓ BUG-A: accepts request touching bookings on both sides
     ↓ BUG-B: available request does not mutate bookings [skipped]

 Test Files  1 passed (1)
      Tests  1 passed | 22 skipped (23)
   Start at  23:14:41
   Duration  774ms (transform 43ms, setup 0ms, collect 32ms, tests 2ms, environment 0ms, prepare 119ms)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
-  bookings.push({ start, end });

 RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/week-08/app

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
   Start at  23:19:09
   Duration  344ms (transform 39ms, setup 0ms, collect 29ms, tests 4ms, environment 0ms, prepare 69ms)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
-

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
