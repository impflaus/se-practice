# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Gemini |
| Coding assistant model | Gemini 3.6 Flash |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/p/72154936 |
| Language | Python |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** The system checks whether one selected campus room is available for a requested time interval. It only reports availability and does not create, confirm, store, or manage bookings.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | The requested start and end must be valid integer minutes between 0 and 1440, the start must be earlier than the end, and the start must be strictly later than the current time. |
| AC2 | A booking request may last no more than 120 minutes. A duration of exactly 120 minutes must still be accepted. |
| AC3 | If the selected room is marked as blocked, every booking request must be rejected regardless of its time. |
| AC4 | The requested interval must not overlap any existing booking. Touching an existing booking exactly at its start or end is allowed. |
| AC5 | The system must clearly show Available or Unavailable and checking availability must not change the existing booking data. |
| AC6 | Validation messages must be understandable, and the interface must remain usable on a narrow mobile screen. |

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | A request that begins exactly when an existing booking ends may be incorrectly rejected as overlapping. | AC4 | Run T1 with existing booking 600–660 and candidate 660–720. The expected result is Available. |
| 2 | A request starting exactly at the current time may be incorrectly accepted. | AC1 | Run T6 with now = 540 and candidate 540–570. The expected result is Unavailable. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Start time of the requested booking in minutes after midnight. | Integer; must satisfy 0 <= start < end <= 1440 and start > now. |
| `end` | End time of the requested booking in minutes after midnight. | Integer from 1 to 1440 and greater than start. |
| `now` | Current time in minutes after midnight. | Valid integer from 0 to 1439. |
| `blocked` | Shows whether the selected room is unavailable for all requests. | Boolean: True or False. |
| `existing` | Collection of already existing booking intervals. | Collection of `(start, end)` pairs; must not be modified by the function. |
| returns | Availability result for the requested interval. | Boolean: True only when AC1–AC4 all hold; otherwise False. |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. The existing booking data is fictional and contains valid start and end times.
2. The function only checks one selected room and does not create or permanently store a new booking.

**Checked manually:**

- I will manually check the boundary conditions for start and end times, the 120-minute duration limit, blocked-room behavior, touching and overlapping intervals, multiple existing bookings, and whether repeated checks leave the original booking data unchanged.

## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if blocked:` | AC3 | Yes | It immediately rejects every request when the selected room is blocked. |
| `if not (0 <= start < end <= 1440 and start > now):` | AC1 | Yes | It checks the valid day bounds, requires start to be before end, and requires the start time to be strictly after now. |
| `if end - start > 120:` | AC2 | Yes | It rejects only durations greater than 120 minutes, so exactly 120 minutes remains valid. |
| `if start < e_end and end > e_start:` | AC4 | Yes | Both comparisons must be true for an overlap. When two intervals only touch at an endpoint, one comparison is false, so touching remains allowed. |
| `return True` | AC5 | Yes | It is reached only after AC1–AC4 pass. The function only iterates over `existing` and does not modify it. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements:

AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| Availability logic | `project/src/lib/availability.ts` | Implements validation and overlap logic for the room availability rules. |
| Time input | `project/src/components/TimeInput.tsx` | Provides the labeled time input used to enter booking times. |
| Result panel | `project/src/components/ResultPanel.tsx` | Displays the Available or Unavailable result. |
| Room schedule | `project/src/components/RoomSchedule.tsx` | Displays fictional existing bookings and blocked-room status. |
| Main application | `project/src/App.tsx` | Connects the components into the one-page room availability checker. |

**What v1 does:**

- The page displays a Smart Campus Room Availability Checker.
- The user can select a room and enter a start and end time.
- The page provides a current time input and a "Use now" button.
- It displays fictional existing bookings and the selected room status.
- It provides "Check availability" and "Reset" actions.
- This is the original Week 06 Bolt version before the later cleanup changes.

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | | | | |
| T2 | Overlap | 630–690 | Unavailable | | | | |
| T3 | Blocked | 660–720, blocked | Unavailable | | | | |
| T4 | Exactly 120 min | 720–840 | Available | | | | |
| T5 | 121 min | 720–841 | Unavailable | | | | |
| T6 | Starts now | 540–570 | Unavailable | | | | |
| T7 | Reversed | 720–660 | Unavailable | | | | |
| T8 | Ends at midnight | 1380–1440 | Available | | | | |
| T9 | Past midnight | 1380–1441 | Unavailable | | | | |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | | | | |
| T11 | Same check twice | 660–720, twice | Available | | | | |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | | |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC2 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC3 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC4 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC5 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC6 | (write here) | (write here) | (write here) | (write here) | (write here) |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) | (write here) |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue (write here)

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) |
| 3 | (write here) | (write here) | (write here) | (write here) |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | (write here) |
| Model / plan | (write here) |
| Tool call | (write here) |
| Observation | (write here) |
| Next step | (write here) |
| Human review | (write here) |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** (write here)

**Reliability, security, responsibility:** (write here)

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

(write here)

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** Gemini
- **Model:** Gemini 3.6 Flash
- **Date:** 2026-10-30
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
I am working on SIS #03 for AI-Driven Software Engineering.

System: Smart Campus Room Availability Checker.

Contract:
can_book(start, end, now, blocked, existing)

Acceptance criteria:
AC1: 0 <= start < end <= 1440, and start must be strictly after now.
AC2: duration must be at most 120 minutes; exactly 120 is allowed.
AC3: reject every request when the room is blocked.
AC4: reject overlap with any existing booking; touching endpoints is allowed.
AC5: return a clear availability result and never mutate existing bookings.
AC6: understandable validation feedback and usable narrow/mobile layout.

For the Python function, propose a short implementation and testing plan only.
Do not write the final code yet.

Include:
1. validation order,
2. assumptions,
3. boundary cases,
4. overlap logic,
5. tests that should be run.

Do not change the acceptance criteria and do not add new features.
~~~~

**Response:**

~~~~text
### 1. Validation Order

To ensure clean error reporting and fast-path rejections, validate inputs in this exact sequence:

1. **AC3 (Room Blocked Check):** Check `blocked == True` first. If blocked, fail immediately.
2. **AC1 (Time Bounds & Relative Time):**
* Check structural bounds: $0 \le \text{start} < \text{end} \le 1440$.
* Check future condition: $\text{start} > \text{now}$.


3. **AC2 (Duration Limit):** Check $(\text{end} - \text{start}) \le 120$.
4. **AC4 & AC5 (Conflict Check & Non-mutation):** Iterate through `existing` safely without modifying the list/tuples to ensure no temporal overlap.

---

### 2. Key Assumptions

* **Time Units:** All times (`start`, `end`, `now`, and intervals in `existing`) are integers representing minutes from midnight ($0$ to $1440$).
* **Data Types:**
* `blocked` is a `bool`.
* `existing` is an iterable of 2-element tuples/lists: `[(e_start, e_end), ...]`.


* **Immutability:** The input collections/tuples will be treated as read-only (AC5).
* **Return Type:** Returns a tuple or structured object: `(is_available: bool, message: str)`.

---

### 3. Boundary Cases to Cover

* **AC1 Bounds:**
* `start = 0`, `end = 1440` (Midnight limits).
* `start = now` (Must fail; must be *strictly* after `now`).
* `start = now + 1` (Smallest valid future offset).
* `start >= end` or `end > 1440` or `start < 0`.


* **AC2 Duration:**
* `end - start = 120` (Exactly 120 minutes — valid).
* `end - start = 121` (Invalid).


* **AC4 Endpoint Touching:**
* Existing interval $[100, 120]$:
* Booking $[80, 100]$ (Touches start endpoint — valid).
* Booking $[120, 140]$ (Touches end endpoint — valid).





---

### 4. Overlap Logic

Two time intervals $[A_{\text{start}}, A_{\text{end}}]$ and $[B_{\text{start}}, B_{\text{end}}]$ overlap if and only if:

$$\text{max}(A_{\text{start}}, B_{\text{start}}) < \text{min}(A_{\text{end}}, B_{\text{end}})$$

Equivalently, booking $A$ and existing booking $B$ conflict if:


$$A_{\text{start}} < B_{\text{end}} \quad \text{and} \quad A_{\text{end}} > B_{\text{start}}$$

This formulation naturally permits endpoint touching (e.g., $A_{\text{start}} = B_{\text{end}}$ yields `False` for overlap).

---

### 5. Proposed Test Plan

| Test Category | Test Case Scenario | Expected Result |
| --- | --- | --- |
| **AC1 Validation** | `start < 0`, `end > 1440`, or `start >= end` | Reject with invalid range error |
|  | `start <= now` (e.g., `start = 100, now = 100`) | Reject ("must be strictly after now") |
|  | `start = now + 1` | Pass (if other criteria met) |
| **AC2 Duration** | Duration = 120 min | Pass |
|  | Duration = 121 min | Reject ("duration exceeds 120 min") |
| **AC3 Blocked** | `blocked = True` with valid times | Reject ("room is blocked") |
| **AC4 Overlap** | Partial or full overlap with existing booking | Reject ("time slot unavailable") |
|  | Endpoint touching (`end == e_start` or `start == e_end`) | Pass |
| **AC5 Side-effects** | Verify `existing` list identity/length post-call | Unchanged |
~~~~

### B2

- **Tool:** Gemini
- **Model:** Gemini 3.6 Flash
- **Date:** 2026-10-30
- **Stage:** Generate
- **Source:** this SIS

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B3

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B4

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
I am working on Stage B (Generate) of SIS #03.

I am reusing my original Week 05 Python v1 for the Smart Campus Room Availability Checker. The code below must remain unchanged because it is stored as code/original/booking_v1.py.

Please reproduce this exact implementation verbatim in one Python code block. Do not improve, rewrite, shorten, or modify it.

# booking.py

def can_book(start, end, now, blocked, existing):
    """
    Checks if a room can be booked based on timing, availability, and existing bookings.
    
    Parameters:
    - start (int): Start time in minutes after midnight.
    - end (int): End time in minutes after midnight.
    - now (int): Current time in minutes after midnight (0-1439).
    - blocked (bool): True if the room is blocked/disabled, False otherwise.
    - existing (iterable): Sequence of (start, end) tuples of active bookings.
    
    Returns:
    - bool: True if all criteria AC1-AC4 hold, False otherwise.
    """
    # AC3: Check if the room is blocked.
    if blocked:
        return False

    # AC1: Validate time boundaries and ensure the booking starts in the future.
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: Check that the booking duration is at most 120 minutes.
    if end - start > 120:
        return False

    # AC4: Check for overlaps with existing bookings.
    # Half-open interval overlap rule: [start, end) overlaps with [e_start, e_end)
    # if start < e_end and end > e_start. Touching endpoints do not overlap.
    for e_start, e_end in existing:
        if start < e_end and end > e_start:
            return False

    # AC5: Return True when all conditions AC1-AC4 pass.
    return True
~~~~

**Response:**

~~~~text
Here is your original `booking_v1.py` implementation reproduced verbatim:

```python
# booking.py

def can_book(start, end, now, blocked, existing):
    """
    Checks if a room can be booked based on timing, availability, and existing bookings.
    
    Parameters:
    - start (int): Start time in minutes after midnight.
    - end (int): End time in minutes after midnight.
    - now (int): Current time in minutes after midnight (0-1439).
    - blocked (bool): True if the room is blocked/disabled, False otherwise.
    - existing (iterable): Sequence of (start, end) tuples of active bookings.
    
    Returns:
    - bool: True if all criteria AC1-AC4 hold, False otherwise.
    """
    # AC3: Check if the room is blocked.
    if blocked:
        return False

    # AC1: Validate time boundaries and ensure the booking starts in the future.
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: Check that the booking duration is at most 120 minutes.
    if end - start > 120:
        return False

    # AC4: Check for overlaps with existing bookings.
    # Half-open interval overlap rule: [start, end) overlaps with [e_start, e_end)
    # if start < e_end and end > e_start. Touching endpoints do not overlap.
    for e_start, e_end in existing:
        if start < e_end and end > e_start:
            return False

    # AC5: Return True when all conditions AC1-AC4 pass.
    return True

```
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
(paste here)
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
