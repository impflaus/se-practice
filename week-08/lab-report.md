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
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

Did the environment show that the skill was invoked? yes / no / not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | | |
| Reproducible test | | |
| Minimal proposed patch | | |
| Unsupported claims | | |
| Clarity of explanation | | |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

-

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
(paste here)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
(paste here)
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
