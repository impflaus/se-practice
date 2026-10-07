# Week 05 — Lab report

**Name: Dauren**
**Group: Monday 16:00 - 19:00**
**Date: 07.10.2026**

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | Gemini |
| **Exact** model name | Gemini 3.6 Flash |
| Language and version | Python 3 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
Implementation Plan

1. Check AC3 (Room Blocked Status): Verify if blocked is True. If True, return False immediately.

2. Check AC1 (Time Boundaries & Chronology): Verify that 0 <= start < end <= 1440 and start > now. If any condition fails, return False.

3. Check AC2 (Maximum Duration): Verify that end - start <= 120. If it exceeds 120, return False.

4. Check AC4 (Overlap with Existing Bookings): Iterate through each (e_start, e_end) pair in existing. Check for an overlap using half-open interval logic. Overlap occurs if start < e_end and end > e_start. If an overlap is found, return False.

5. Return Decision (AC5): If all checks pass without returning False, return True.

Key Assumptions

- start, end, and now are integers.
- blocked is a Boolean.
- existing is iterable/list/tuple of (start, end) integer pairs.
- Bookings use half-open intervals [start, end).
- existing is read-only and must not be modified.

Suggested Boundary Test Cases

- end exactly 1440 -> True if all other rules pass.
- end 1441 -> False.
- start == now -> False.
- start one minute after now -> True if all other rules pass.
- duration exactly 120 minutes -> True.
- duration 121 minutes -> False.
- touching endpoints -> True.
- partial overlap at start -> False.
- partial overlap at end -> False.
- enclosing interval -> False.
- identical interval -> False.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | The plan checks blocked status, valid time range, maximum duration, overlap with existing bookings, and returns True only if all checks pass. | These steps match AC3, AC1, AC2, AC4, and AC5 respectively. | I checked all five plan steps against AC1-AC5 and found no invented or changed rules. |

**Boundary cases the assistant suggested that I kept as tests:**

- `end == 1440`
- `end == 1441`
- `start == now`
- duration exactly 120 minutes
- duration 121 minutes
- touching an existing booking
- partial overlap with an existing booking
- identical interval with an existing booking

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes 

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if blocked: return False` | AC3 | Yes. AC3 requires the room not to be blocked. |
| 2 | `if not (0 <= start < end <= 1440 and start > now): return False` | AC1 | Yes. It checks the day bounds, positive duration, and future start. |
| 3 | `if end - start > 120: return False` | AC2 | Yes. It rejects durations over 120 minutes and allows exactly 120. |
| 4 | `if start < e_end and end > e_start: return False` | AC4 | Yes. It detects overlap for half-open intervals and allows touching endpoints. |
| 5 | `return True` | AC5 | Yes. It is reached only if AC1-AC4 all pass. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- None. The implementation stays within AC1-AC5 and the function contract.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `test_touching_end_is_allowed` | `(660, 720)` | None | True | AC4 | PASS | PASS |
| 2 | `test_overlap_is_rejected` | `(630, 690)` | None | False | AC4 | PASS | PASS |
| 3 | `test_blocked_room_is_rejected` | `(660, 720)` | `blocked=True` | False | AC3 | PASS | PASS |
| 4 | `test_exactly_two_hours_is_allowed` | `(720, 840)` | None | True | AC2 | PASS | PASS |
| 5 | `test_over_two_hours_is_rejected` | `(720, 841)` | None | False | AC2 | PASS | PASS |
| 6 | `test_starting_now_is_rejected` | `(540, 570)` | None | False | AC1 | PASS | PASS |
| 7 | `test_zero_length_is_rejected` | `(700, 700)` | None | False | AC1 | PASS | PASS |
| 8 | `test_reversed_time_is_rejected` | `(720, 700)` | None | False | AC1 | PASS | PASS |
| 9 | `test_end_at_1440_is_allowed` | `(1380, 1440)` | `existing=[]` | True | AC1 | PASS | PASS |
| 10 | `test_empty_existing_is_allowed` | `(600, 660)` | `existing=[]` | True | AC4 | PASS | PASS |
| 11 | `test_second_booking_overlap_is_rejected` | `(720, 780)` | `existing=[(600,660),(700,760)]` | False | AC4 | PASS | PASS |
| 12 | `test_existing_is_unchanged` | `(780, 840)` | several bookings; compare list before/after | unchanged | AC5 | PASS | PASS |
| 13 | `test_booking_inside_existing_is_rejected` | `(615, 645)` | None | False | AC4 | PASS | PASS |
| 14 | `test_booking_contains_existing_is_rejected` | `(570, 690)` | None | False | AC4 | PASS | PASS |
| 15 | `test_touching_start_is_allowed` | `(570, 600)` | None | True | AC4 | PASS | PASS |
| 16 | `test_end_after_1440_is_rejected` | `(1381, 1441)` | `existing=[]` | False | AC1 | PASS | PASS |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(1381, 1441, 540, False, [])` | False | False | `if not (0 <= start < end <= 1440 and start > now): return False` | No code change was needed. I added a missing test for the upper day bound. | The checker M2 exposed the missing AC1 test coverage. |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
No concrete issues found.

The provided code fully satisfies every rule in the contract and acceptance criteria:

1. AC1 (0 <= start < end <= 1440, and start > now): Checked on line 18 (`if not (0 <= start < end <= 1440 and start > now): return False`).

2. AC2 (Duration is at most 120 minutes): Checked on line 21 (`if end - start > 120: return False`).

3. AC3 (The room is not blocked): Checked on line 15 (`if blocked: return False`).

4. AC4 (No overlap with an existing booking. Touching endpoints are allowed): Checked on lines 24-26 using standard half-open interval overlap logic `start < e_end and end > e_start`, which allows touching endpoints (e.g., `end == e_start` or `start == e_end` evaluates to False).

5. AC5 (Return True only when AC1-AC4 hold... never alter existing): Checked on line 28 (`return True`), and `existing` is strictly read during iteration without modification.

6. Contract requirements: Retains signature `can_book(start, end, now, blocked, existing)` and uses read-only access.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | The AC1 condition correctly checks `0 <= start < end <= 1440` and `start > now`. | accept | AC1 requires exactly these time bounds and future start. | 16 tests, OK |
| 2 | The AC2 condition correctly rejects durations greater than 120 minutes. | accept | AC2 says duration is at most 120 minutes, so exactly 120 must remain allowed. | 16 tests, OK |
| 3 | The blocked-room check correctly implements AC3. | accept | AC3 says the room must not be blocked. | 16 tests, OK |
| 4 | The overlap condition `start < e_end and end > e_start` correctly implements half-open intervals and allows touching endpoints. | accept | AC4 says overlaps are rejected and touching endpoints are allowed. | 16 tests, OK |
| 5 | The final `return True` and read-only iteration over `existing` correctly satisfy AC5. | accept | AC5 requires True only after AC1-AC4 pass and says `existing` must not be altered. | 16 tests, OK |
| 6 | The implementation keeps the required `can_book(start, end, now, blocked, existing)` signature. | accept | The function contract requires this exact name and parameter order. | 16 tests, OK |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | No change to `booking.py`; v1 and final are identical. | v1 already satisfies AC1-AC5, so changing correct code was unnecessary. | F1-F10 all PASS. M2 was fixed by adding `test_end_after_1440_is_rejected`, not by changing the function. |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_booking_contains_existing_is_rejected (test_booking.BookingTests.test_booking_contains_existing_is_rejected) ... ok
test_booking_inside_existing_is_rejected (test_booking.BookingTests.test_booking_inside_existing_is_rejected) ... ok
test_empty_existing_is_allowed (test_booking.BookingTests.test_empty_existing_is_allowed) ... ok
test_end_after_1440_is_rejected (test_booking.BookingTests.test_end_after_1440_is_rejected) ... ok
test_end_at_1440_is_allowed (test_booking.BookingTests.test_end_at_1440_is_allowed) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_is_unchanged (test_booking.BookingTests.test_existing_is_unchanged) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_reversed_time_is_rejected (test_booking.BookingTests.test_reversed_time_is_rejected) ... ok
test_second_booking_overlap_is_rejected (test_booking.BookingTests.test_second_booking_overlap_is_rejected) ... ok
test_starting_now_is_rejected (test_booking.BookingTests.test_starting_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 16 tests in 0.000s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (37 lines)
PASS   S1   your suite has at least 11 tests            16 tests
PASS   S2   your suite is green on your own code        16 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starting_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_1440_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_second_booking_overlap_is_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_booking_contains_existing_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_is_unchanged
PASS   M10  your tests catch a fault in AC5             caught by test_existing_is_unchanged
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              5 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  16 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 6 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      156 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.

```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All checker failures were fixed before the final run. |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- My function does not explicitly handle non-integer times. The contract says that the time values are integers, so I treated non-integer input as outside the supported contract. I did not add extra type validation because that would introduce behavior that was not required.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- The bound `0 <= start` can never be the only reason for rejection. Since `now` is always between 0 and 1439, any negative `start` also fails `start > now`. So a negative start violates at least two parts of AC1 at the same time.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->

```text
The overlap condition in my final function is `start < e_end and end > e_start`. Both comparisons must be true for two half-open intervals to share actual time. If the new booking starts exactly when an existing booking ends, `start < e_end` is false. If it ends exactly when another booking starts, `end > e_start` is false. This is why touching bookings are allowed.

The fault my tests missed for the longest time was the upper day boundary. I tested `end == 1440`, but I did not initially test a value just outside the valid range. The checker exposed this with M2, so I added `test_end_after_1440_is_rejected` using `end = 1441`.

One decision the contract did not make was how to handle non-integer times. I decided not to add type validation because the contract already states that times are integers. Therefore non-integer input is outside the supported contract rather than a new validation rule.
```
