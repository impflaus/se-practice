# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Gemini |
| Assistant model | Gemini 3.6 Flash |
| Starting point | week-08 |
| Baseline commit | 138afc8 |
| Language (ts or js) | ts |
| Vitest version | 2.1.9 |
| Where I ran the tests | my computer |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
 RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/sis-04/app

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
   Start at  17:29:45
   Duration  427ms (transform 36ms, setup 0ms, collect 27ms, tests 5ms, environment 0ms, prepare 160ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
app/src/App.tsx — main React page. It stores the selected room and time inputs, calls canBook(), and renders the booking form, result and room schedule.

app/src/booking.ts — contains the canBook() booking decision function for AC1–AC5.

app/src/booking.test.ts — Vitest regression suite from Week 08 with 23 tests for the existing booking rules.

app/src/data/rooms.ts — contains the current fictional room data used by the page.

app/src/lib/availability.ts — contains additional availability helpers such as checkAvailability(), time conversion helpers and constants.

app/src/types.ts — shared TypeScript types such as Room and CheckResult.

app/src/components/TimeInput.tsx — reusable time input component.

app/src/components/ResultPanel.tsx — displays the availability result.

app/src/components/RoomSchedule.tsx — displays the selected room and its schedule.

app/src/main.tsx — React application entry point.

app/src/index.css — global styles and responsive presentation.
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am extending an existing Smart Campus Room Availability Checker for SIS #04.

Do not rewrite the whole application and do not provide code yet. First analyze the current structure, identify maintainability risks with specific file/function references, and propose a small numbered improvement plan. The safest and smallest change should come first.

Current repository map:

app/src/App.tsx — main React page. It stores the selected room and time inputs, calls canBook(), and renders the booking form, result and room schedule.

app/src/booking.ts — contains the canBook() booking decision function for AC1–AC5.

app/src/booking.test.ts — Vitest regression suite from Week 08 with 23 tests for the existing booking rules.

app/src/data/rooms.ts — contains the current fictional room data used by the page.

app/src/lib/availability.ts — contains additional availability helpers such as checkAvailability(), time conversion helpers and constants.

app/src/types.ts — shared TypeScript types such as Room and CheckResult.

app/src/components/TimeInput.tsx — reusable time input component.

app/src/components/ResultPanel.tsx — displays the availability result.

app/src/components/RoomSchedule.tsx — displays the selected room and its schedule.

app/src/main.tsx — React application entry point.

app/src/index.css — global styles and responsive presentation.

Existing requirements that must remain unchanged:

AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration of 120 minutes.
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

New SIS #04 requirements:

F1 Capacity filter: room capacity must be greater than or equal to the requested attendees.
F2 Equipment filter: the room must contain ALL selected required items.
F3 A blocked room cannot be reported as available.
F4 Show a clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result appropriately, and the availability check must use that room's own bookings.

Constraints:

- No login.
- No payments.
- No live APIs.
- No database.
- Fictional data only.
- At least four rooms.
- Each room must have id, name, capacity, equipment, blocked status and its own bookings.
- The final required modules are rooms.ts, filter.ts, booking.ts and the UI.
- canBook() behavior for AC1–AC5 must remain unchanged.
- Make small changes, not a full rewrite.
- Do not provide implementation code yet.

Please:
1. Identify at least three maintainability risks in the current structure, naming the relevant file or function.
2. Explain why each risk matters for AC1–AC6 or F1–F5.
3. Give each risk a High, Medium or Low priority.
4. Propose a numbered improvement plan with the smallest safe step first.
5. Include at least one suggestion that could reasonably be rejected or modified, so I can evaluate it myself.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Booking logic and UI flow are too tightly coupled | `src/App.tsx`, `handleCheck()` | `handleCheck()` parses time input, calls `canBook()`, also calls `checkAvailability()`, combines both results, and updates UI state in the same function. This makes future F1-F5 changes harder to test independently. | High |
| 2 | Availability is calculated through two different paths | `src/App.tsx`, `handleCheck()`; `src/booking.ts`; `src/lib/availability.ts` | `handleCheck()` calls both `canBook()` and `checkAvailability()`, then overwrites the decision in `finalCheck`. Two rule paths can diverge and create inconsistent AC1-AC5 results. | High |
| 3 | Room changing does not explicitly clear the previous availability result | `src/App.tsx`, room `<select>` | The room selector only calls `setRoomId(e.target.value)`. The existing `result` and `lastInterval` remain until another availability check is performed, which is a risk for F5. | High |
| 4 | The required filtering module does not exist yet | `src/` | There is no `src/filter.ts`. Capacity and equipment filtering required by F1 and F2 therefore have no isolated module that can be tested independently. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Keep the existing `canBook()` behavior unchanged and first add the required room catalog structure with at least four complete fictional rooms.
2. Create `src/filter.ts` with a pure `filterRooms()` function for F1 capacity filtering and F2 equipment filtering, with tests before UI integration.
3. Add `checkRoom()` to `src/booking.ts` so it finds the selected room and calls the existing `canBook()` with that room's own blocked status and bookings.
4. Update `App.tsx` to use the catalog and filtering modules, add attendee/equipment controls, show the F4 empty state, and clear the previous result when the selected room changes for F5.
5. Refactor remaining duplicated availability/data responsibilities, keep the full AC1-AC5 suite green, and create the before/after PlantUML diagrams.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Refactor `canBook()` in `src/booking.ts` so it calls `filterRooms()` internally before checking time slots. | Rejected | `canBook()` must preserve the existing AC1-AC5 behavior and remain focused on booking availability. `filterRooms()` is required as a separate module for F1 and F2. Combining them would mix room filtering with time-slot validation and make both responsibilities harder to test independently. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

I added a new room catalog in `src/rooms.ts` with four fictional rooms: A-204, B-105, C-301 and D-102. Each room has its own capacity, equipment list, blocked status and booking data. The available equipment includes Projector, Whiteboard, Computers and TV.

I added attendee and equipment controls to the page. The UI calls `filterRooms()` so only rooms with enough capacity and all selected equipment are shown. When no rooms match, the page displays `No rooms match your requirements.`

I also added `checkRoom()` in `src/booking.ts`. It finds the selected room and passes that room's blocked status and bookings to the existing `canBook()` function. When the selected room changes, the previous availability result and interval are cleared so an old result is not shown for a different room.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees = 1 with Projector and Whiteboard selected. Only A-204 matches because it contains both required equipment items and has enough capacity. |
| `evidence/filter-empty.png` | Attendees = 20 with no required equipment. No room has enough capacity, so the page shows `No rooms match your requirements.` |
| `evidence/switch-a.png` | A-204 is selected with current time 09:00 and requested interval 10:00–11:00. The result is Unavailable because A-204 already has a booking from 10:00–11:00. |
| `evidence/switch-b.png` | B-105 is selected with the same 10:00–11:00 interval. The result is Available because B-105's own booking is 12:00–13:00. |
| `evidence/narrow.png` | The application shown in a narrow mobile-sized viewport. The controls remain readable and the layout adapts without requiring a separate mobile page. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Defines the Room type and stores the fictional room catalog used by the application. |
| `src/booking.ts` | Contains the existing `canBook()` booking rules and `checkRoom()` for checking the selected room's own blocked status and bookings. |
| `src/filter.ts` | Contains the pure `filterRooms()` function for capacity and equipment filtering. |
| `src/App.tsx` | Holds UI state, displays filtering controls and delegates filtering and booking decisions to the domain modules. |
| `src/components/RoomSchedule.tsx` | Displays the selected room, capacity, equipment, blocked status and booking times. |
| `src/lib/availability.ts` | Contains presentation helpers for converting between minutes and HH:MM time labels. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep `filterRooms()` separate from `canBook()` and `checkRoom()`. | Make `canBook()` call `filterRooms()` before checking a time slot. | F1 and F2 are room-selection rules, while AC1–AC5 are booking rules. Keeping them separate preserves the existing `canBook()` behavior and makes both modules independently testable. |
| Keep blocked rooms visible in the filtered room list and reject them during availability checking. | Remove blocked rooms completely inside `filterRooms()`. | F3 only requires that a blocked room cannot be reported as available. Keeping the room visible makes its blocked state explicit in the UI while `checkRoom()` still guarantees that it returns unavailable. |
| Clear the previous result whenever the selected room or filter criteria changes. | Keep the old result visible until the user presses Check again. | The old result could describe a different room, which would be misleading and would violate the intent of F5. |
### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/App.tsx` used both `canBook()` and `checkAvailability()` to calculate availability, creating two booking-rule paths. | Booking decisions now go through `canBook()` and `checkRoom()` in `src/booking.ts`. |
| `src/data/rooms.ts` contained the old room catalog and used a separate Room model. | The final room catalog and Room type are centralized in `src/rooms.ts`. |
| `src/lib/availability.ts` duplicated overlap, duration, blocked-room and time-validation rules already handled by `canBook()`. | `src/lib/availability.ts` now only contains time-formatting helpers; booking rules remain in `src/booking.ts`. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `AC1 T02: rejects request starting exactly at current time (540-570)` | start = 540, end = 570, now = 540 → false |
| AC2 | `B1 AC2: accepts booking of exactly 120 minutes (720-840)` | 720–840 is exactly 120 minutes → true |
| AC3 | `AC3 T13: rejects request on a blocked room (660-720)` | valid interval with blocked = true → false |
| AC4 | `B4 AC4: rejects request overlapping end of existing booking (630-690)` | request overlaps existing 600–660 booking → false |
| AC5 | `AC5: returns explicit boolean and leaves frozen input data untouched` | frozen booking list → boolean result and original data unchanged |
| F1 | `F1 B5: includes a room when capacity exactly equals attendees` | attendees = 8, room capacity = 8 → room included |
| F2 | `F2: room must contain ALL selected equipment` | Projector + Whiteboard required → only rooms containing both remain |
| F3 | `F3: blocked room is never available` | blocked room C, valid free interval → false |
| F4 | `F4: returns an empty list when no rooms match` | attendees = 20 → empty array |
| F5 | `F5: uses the selected room's own bookings` | A overlaps 600–660 → false; B has different booking → true |
| B1 | `B1 AC2: accepts booking of exactly 120 minutes (720-840)` | duration = 120 → true |
| B2 | `B2 AC2: rejects booking exceeding 120 minutes (720-841)` | duration = 121 → false |
| B3 | `B3 AC4: accepts request touching endpoint after existing booking (660-720)` | existing booking ends at 660, request starts at 660 → true |
| B4 | `B4 AC4: rejects request overlapping end of existing booking (630-690)` | overlap with 600–660 → false |
| B5 | `F1 B5: includes a room when capacity exactly equals attendees` | capacity = attendees = 8 → included |
| B6 | `F1 B6: excludes a room one seat below requested attendees` | capacity = 8, attendees = 9 → excluded |
| INT | `INT: filters matching rooms and checks the selected room's own bookings` | filter A/B, then check 600–660 → A false, B true |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
npx vitest run src/rooms.test.ts
npx vitest run src/filter.test.ts
npx vitest run src/checkRoom.test.ts
npx vitest run src/integration.test.ts
npx vitest run src/booking.test.ts
npx vitest run
npm run build
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
 RUN  v2.1.9 /Users/daurenkaztay/Desktop/3year/SE /se-practice/sis-04/app

 ✓ src/booking.test.ts (23)
 ✓ src/checkRoom.test.ts (3)
 ✓ src/filter.test.ts (4)
 ✓ src/integration.test.ts (1)
 ✓ src/rooms.test.ts (1)

 Test Files  5 passed (5)
      Tests  32 passed (32)
   Start at  01:52:00
   Duration  630ms (transform 225ms, setup 0ms, collect 301ms, tests 19ms, environment 1ms, prepare 608ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
