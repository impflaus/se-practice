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
(paste here)
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
(paste here)
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes / no

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | | | accept / revise / reject | |
| 2 | | | accept / revise / reject | |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
(paste here)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
(paste here)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
(paste here)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

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
