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
| Model | Gemini 3.6 Flash |
| Starting point | week-08 |
| Baseline commit | 138afc8 |
| Language | ts |
| Vitest | 2.1.9 |
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
| Automated tests passed / total | 23/23 | 32/32 | Compared the baseline Vitest run in section 1.1 with the final Vitest run in section 6.3. |
| Duplicated logic locations removed | 2 duplicated responsibility areas identified | 0 remaining in the booking decision path | Compared the duplicated `canBook()` + `checkAvailability()` path and old room-model/catalog structure with the final modules described in section 5.3. |
| Code structure: modules and their responsibilities | 12 files in `app/src`; booking rules, room data and availability logic were split across overlapping locations | 17 files in `app/src`; room data, filtering, booking rules, UI and tests have separate responsibilities | Counted the source files from the baseline repository map and used `git ls-files app/src \| wc -l` for the final structure. |
| Remaining limitation | No capacity/equipment filtering and no selected-room integration | The app still uses fictional in-memory data only and does not persist bookings | Compared the baseline functionality with the final implementation and project constraints. |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** Gemini — Gemini 3.6 Flash
**Date:** 2026-11-10
**Purpose:** Analyze the starting codebase, identify maintainability risks, and propose a safe improvement direction before editing the application.

**Prompt:**

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

**Output used:**

```text
Maintainability Risks Analysis

1. **Tight Coupling between Filter Logic and Booking State in `App.tsx**`
* **Location:** `app/src/App.tsx`
* **Why it matters:** The main page component manages both UI state and domain interaction. Integrating multi-attribute filtering (capacity and equipment for **F1**, **F2**, **F4**) directly into `App.tsx` will make the component bloated and hard to test without full UI rendering.
* **Priority:** **High**


2. **Scattered Room Schema and Incomplete Model Definition**
* **Location:** `app/src/types.ts` and `app/src/data/rooms.ts`
* **Why it matters:** Current room definitions lack fields required by the new requirements (such as `capacity` and `equipment` per room). Without centralized, strict TypeScript definitions, `canBook()`, filtering functions, and UI components risks using incompatible room structures or breaking existing endpoint checks (**AC4**, **F1**, **F2**, **F5**).
* **Priority:** **High**


3. **Potential Duplicate Time / Schedule Logic across `booking.ts` and `availability.ts**`
* **Location:** `app/src/booking.ts` and `app/src/lib/availability.ts`
* **Why it matters:** `availability.ts` already contains time conversion helpers and `checkAvailability()`. If `canBook()` and the new filter logic re-implement date parsing or time-window calculations, subtle discrepancies could break past-date rejection or endpoint touching rules (**AC1**, **AC4**).
* **Priority:** **Medium**


4. **Missing Modular Isolation for Room Filtering**
* **Location:** Missing module `app/src/filter.ts` (currently required by SIS #04 specification).
* **Why it matters:** If room selection, filtering by attendee count, and equipment matching logic are mixed into `booking.ts` or `App.tsx`, unit testing **F1–F4** independently of core booking logic (**AC1–AC5**) will become difficult.
* **Priority:** **Medium**



---

Step-by-Step Improvement Plan

1. **Update Domain Types (`app/src/types.ts`)**
Extend the `Room` interface to include `capacity: number`, `equipment: string[]`, `blocked: boolean`, and `bookings: Booking[]`. Ensure `canBook()` and filter function input parameters strictly conform to this contract without changing existing return types.
2. **Expand Fictional Data Set (`app/src/data/rooms.ts`)**
Update the dataset to include at least 4 rooms with realistic variations in capacity, equipment arrays, blocked status, and room-specific bookings.
3. **Extract Pure Room Filtering into `app/src/filter.ts**`
Create `filterRooms()` to execute **F1** (capacity check), **F2** (equipment subset matching), and **F3** (filtering out or marking blocked rooms). Keep this pure and easily testable with unit tests before wiring it into UI components.
4. **Wire Filtering and State Handling in `App.tsx**`
Update state management to filter the room list dynamically, update selected room availability on change (**F5**), and display an explicit empty state component when no rooms match (**F4**).
5. **Add Unit Test Coverage (`app/src/filter.test.ts`)**
Create focused tests for room filtering while keeping existing `booking.test.ts` suites completely green to verify zero regressions on **AC1–AC5**.

---

Candidate Suggestion for Review (Optional / Evaluative)

* **Proposal:** Refactor `canBook()` inside `app/src/booking.ts` to call `filterRooms()` internally before checking time slots.
* **Why it could be rejected/modified:** `canBook()` is evaluated against existing tests in `app/src/booking.test.ts` for **AC1–AC5**. Coupling time-slot checking with room metadata filters inside `canBook()` risks breaking the legacy test suite contract or blurring the boundary between "Is this room matching user preferences?" (filtering) and "Is this target time-window valid for this room?" (booking evaluation). Keeping them decoupled allows independent execution and testing.
```

**Problems found:** The assistant correctly identified duplicated availability logic and missing filtering separation. However, I did not accept the suggestion to make `canBook()` call `filterRooms()`, because it would mix filtering rules with booking rules.
**Changes made:** I used the analysis to separate room data, filtering and booking responsibilities. I created `rooms.ts`, `filter.ts`, later added `checkRoom()` to `booking.ts`, and kept `canBook()` behavior unchanged.
**Verified by:** The analysis and plan were committed before source-code changes in commit `3f9cee0`. The original 23 booking tests remained passing while the new functionality was added.

### 8.2 Exchange 2

**Tool and model:** Gemini — Gemini 3.6 Flash
**Date:** 2026-11-10
**Purpose:** Create an incremental implementation plan before changing the application structure.

**Prompt:**

```text
Based on the analysis above, give me a small implementation plan for SIS #04.

Important constraints:
- Keep canBook() behavior for AC1–AC5 unchanged.
- Do not rewrite the whole application.
- Add the required modules incrementally.
- Use test-first changes where possible.
- Keep each change small enough to verify before moving to the next one.
- The final structure must include rooms.ts, filter.ts, booking.ts and the UI.
- F1–F5 must be covered.
- I also need to remove duplicated availability logic later without breaking existing tests.

Please give:
1. A numbered implementation order.
2. What file should be changed in each step.
3. What should be tested after each step.
4. Which step has the highest risk of breaking existing behavior.
5. One suggestion I should be careful about or possibly reject.

Do not provide full implementation code yet.
```

**Output used:**

```text
Here is a structured, incremental implementation plan designed to complete SIS #04 safely without triggering regressions.

---

1 & 2. Numbered Implementation Order & Target Files

1. **Step 1: Type Definitions (`app/src/types.ts`)**
* Extend the `Room` interface to include `capacity: number`, `equipment: string[]`, `blocked: boolean`, and `bookings: Booking[]`.
* Add a `FilterCriteria` interface for attendees and equipment selection.


2. **Step 2: Room Dataset Expansion (`app/src/data/rooms.ts`)**
* Update the sample data to contain at least 4 rooms matching the expanded `Room` interface, ensuring distinct capacities, equipment tags, blocked statuses, and existing booking schedules.


3. **Step 3: Test-First Unit Suite for Filtering (`app/src/filter.test.ts`)**
* Write Vitest tests for `filterRooms()` covering **F1** (capacity $\ge$ attendees), **F2** (equipment subset matching), and **F3** (handling blocked rooms).


4. **Step 4: Implement Pure Filter Module (`app/src/filter.ts`)**
* Create `filterRooms(rooms: Room[], criteria: FilterCriteria): Room[]` to make all tests in `app/src/filter.test.ts` pass cleanly without touching `booking.ts`.


5. **Step 5: Refactor Duplicated Availability Logic (`app/src/lib/availability.ts` & `app/src/booking.ts`)**
* Consolidate time parsing and overlap functions into `availability.ts` and delegate to them inside `booking.ts` while keeping the exact signature and output contract of `canBook()`.


6. **Step 6: UI Integration & React State (`app/src/App.tsx` & UI components)**
* Add filter controls to `App.tsx`, connect `filterRooms()`, implement empty-state rendering (**F4**), and ensure selecting a room re-evaluates `canBook()` against that specific room's schedule (**F5**).



---

3. Verification & Testing Strategy After Each Step

* **After Step 1:** Run `tsc --noEmit` to verify zero type mismatches in existing files.
* **After Step 2:** Run `vitest run booking.test.ts` to confirm sample data changes haven't broken legacy **AC1–AC5** tests.
* **After Step 3:** Run `vitest run filter.test.ts` (expect tests to fail due to missing implementation).
* **After Step 4:** Run `vitest run filter.test.ts` to confirm **F1–F3** pass, and run `booking.test.ts` to confirm zero collateral damage.
* **After Step 5:** Run `vitest run` across the entire test suite (**AC1–AC5** must remain 100% green).
* **After Step 6:** Manual UI check for desktop/mobile layouts (**AC6**), empty states (**F4**), and dynamic room selection updates (**F5**).

---

4. Highest Risk Step

**Step 5 (Refactoring Duplicated Availability Logic)** carries the highest risk of breaking existing behavior.

* **Why:** Extracting time-parsing or endpoint-touching logic into shared helpers in `availability.ts` risks subtle regressions in corner cases (e.g., boundary end-time touching vs. overlapping in **AC4**, or past-date checks in **AC1**). Executing `vitest run booking.test.ts` directly after this refactor is essential before touching UI code.

---

5. Suggestion to Treat with Caution / Consider Rejecting

* **Suggestion:** *Automatically hiding blocked rooms inside `filterRooms()` so they never appear in the UI dropdown.*
* **Why to be careful/reject:** Requirement **F3** states "A blocked room cannot be reported as available," but **AC3** states "Reject a blocked room." If `filterRooms()` completely strips blocked rooms from the list, a user who specifically selects or inspects a blocked room will never see the explicit "Unavailable / Room is blocked" feedback required by **AC3** & **AC5**.
* **Alternative:** `filterRooms()` can include blocked rooms (or flag them) so the UI can still display them with their blocked status clearly marked when selected.
```

**Problems found:**  Some parts of the suggested file structure did not match the final required architecture. The plan suggested extending the old types.ts and data/rooms.ts, but the assignment required a dedicated rooms.ts. It also suggested consolidating booking helpers into availability.ts, which could have kept two overlapping booking-rule locations.
**Changes made:** I modified the plan by creating a new src/rooms.ts as the single room catalog and Room type. I created src/filter.ts separately, added checkRoom() to src/booking.ts, and kept blocked rooms visible in the filtered list. Later, instead of moving booking rules into availability.ts, I removed the duplicated booking logic from that file and kept only time-formatting helpers.
**Verified by:** Targeted filtering and room tests were run after each small change, the original booking suite stayed green, and the final complete Vitest run passed 32/32 tests.

### 8.3 Exchange 3

**Tool and model:** Gemini — Gemini 3.6 Flash
**Date:** 2026-11-10
**Purpose:** Review the final refactored structure, identify remaining risks, and recommend final verification steps before submission.

**Prompt:**

```text
I have now implemented the SIS #04 room catalog, filtering, selected-room availability checks, UI integration, and tests.

Current final structure:
- src/rooms.ts — Room type and fictional room catalog
- src/filter.ts — filterRooms()
- src/booking.ts — canBook() and checkRoom()
- src/App.tsx — UI state and controls
- src/lib/availability.ts — time formatting helpers only
- tests cover AC1–AC5, F1–F5, B1–B6 and INT

Current result:
- 32/32 Vitest tests pass
- npm run build succeeds
- the old duplicated checkAvailability() path was removed
- the old src/data/rooms.ts was removed
- blocked rooms remain visible but checkRoom() rejects them
- switching rooms clears the previous result

Please review this final structure from a maintainability and regression-risk perspective.

I need:
1. Two or three things that are improved compared with the original structure.
2. Any remaining maintainability risk or limitation.
3. Whether keeping filterRooms() separate from canBook()/checkRoom() is a good decision.
4. Whether removing duplicated availability rules from lib/availability.ts was safer than keeping two rule paths.
5. What final verification steps you recommend before submission.

Do not rewrite the application and do not provide a new architecture.
```

**Output used:**

```text
1. Key Architectural Improvements

* **Clean Separation of Concerns:** Room matching based on criteria (`filterRooms()`) is now cleanly decoupled from time-slot availability evaluation (`checkRoom()` / `canBook()`). This isolates preference matching from scheduling logic, making both domains easier to test and reason about.
* **Single Source of Truth for Domain Rules:** Consolidating room definitions in `rooms.ts` and availability execution in `booking.ts` eliminated duplicated schemas (`data/rooms.ts` vs `types.ts`) and redundant time-checking logic (`checkAvailability()` in `availability.ts`).
* **Preserved Diagnostic Feedback for Blocked Rooms:** Keeping blocked rooms visible in the catalog while allowing `checkRoom()` to explicitly reject them satisfies both **F3** and **AC3** cleanly, preserving explicit error feedback for users selecting a blocked room.

---

2. Remaining Maintainability Risks & Limitations

* **Pure UI Component State Coupling in `App.tsx`:** If state updates (clearing previous results upon switching rooms, syncing filter options, managing form inputs) remain strictly embedded within `App.tsx`, adding future UI interactions may lead to component bloat. Extracting a custom hook (e.g., `useBookingState`) could be considered in future iterations if the UI expands.
* **Lack of Date-Aware Booking Boundaries:** Currently, `canBook()` and `checkRoom()` handle daily time windows. If multi-day or recurring bookings are added in future assignments, time-window checking will need expansion beyond standard daily HH:mm format logic.

---

3. Separation of `filterRooms()` vs. `canBook()` / `checkRoom()`

**Yes, keeping them separate was the correct architectural decision.**

* **Distinct Responsibilities:** `filterRooms()` evaluates static multi-attribute matching (capacity $\ge$ attendees, equipment subset inclusion). `canBook()` evaluates temporal logic (start/end boundaries, max duration, endpoint overlap).
* **Test Isolation:** Decoupling ensures that legacy tests for **AC1–AC5** run without needing mock capacity or equipment data injected into every test case in `booking.test.ts`.

---

4. Removal of Duplicated Availability Logic in `lib/availability.ts`

**Removing the duplicate `checkAvailability()` path was significantly safer than maintaining dual rule paths.**

Having two functions performing time-slot checks introduces divergence risk over time (where an endpoint-touching rule in **AC4** might be updated in `canBook()` but forgotten in `checkAvailability()`). Reducing `lib/availability.ts` strictly to pure date/time formatting helpers ensures all availability decisions pass through a single, authoritative execution path.

---

5. Recommended Final Verification Steps Before Submission

1. **Full Test Suite Execution:**
Run `npx vitest run --coverage` to ensure 100% pass rate across all 32 tests and verify no dead code branches remain in `filter.ts` or `booking.ts`.
2. **Production Build & Type Check:**
Execute `npm run build` followed by `npx tsc --noEmit` to confirm zero TypeScript warnings or bundling issues.
3. **Manual Edge-Case QA in UI:**
* **F4 Empty State:** Enter an attendee count higher than any room's capacity (e.g., `999`) or select all equipment options to verify the UI empty state renders cleanly.
* **F5 Room Switch Reset:** Select a room, calculate availability to display a result, then switch to a different room; confirm the old result clears immediately.
* **AC4 Endpoint Touch:** Check a time slot ending exactly when an existing booking starts (e.g., 10:00–11:00 vs 11:00–12:00) to confirm it is reported as `Available`.
* **AC6 Responsive Check:** Inspect layout responsiveness on mobile (375px width) and desktop screen sizes.
```

**Problems found:** The assistant identified that App.tsx still contains several UI-state responsibilities and that the current application supports only a one-day schedule. These are valid remaining limitations, but they are outside the required SIS #04 scope.
**Changes made:** No additional architecture changes were made because the required modules were already separated and all required behavior was working. I kept the current structure and used the assistant's response mainly as a final review checklist.
**Verified by:** The complete Vitest suite passed 32/32 tests, npm run build completed successfully, and I manually checked the empty state, room switching, blocked-room behavior and narrow responsive layout.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| none | none |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

For this assignment, I gave the AI assistant the structure of my existing Week 08 project, the current files, AC1–AC6, the new F1–F5 requirements, and the constraints of SIS #04. I also explained that I wanted small changes instead of a complete rewrite and that the existing canBook() behavior should remain unchanged.

The most useful AI suggestions were separating room filtering from booking logic, creating a dedicated filterRooms() function, and checking the selected room through its own bookings. The assistant also helped identify duplicated availability logic between canBook() and checkAvailability(). However, I did not follow every suggestion. For example, I rejected the idea of connecting filterRooms() directly with canBook(), because filtering by capacity and equipment is a different responsibility from validating a booking time.

I personally verified every important change. I ran targeted Vitest tests after adding the room catalog, filterRooms(), and checkRoom(). I also ran the full test suite several times and checked that the original AC1–AC5 tests still passed. I manually tested capacity filtering, equipment filtering, blocked rooms, the empty state, switching between rooms, and the narrow mobile layout.

Tests strongly influenced my decisions because I made small changes and checked the result before continuing. The final suite increased from 23 passing tests to 32 passing tests without breaking the previous behavior.

If I continued this project, I would reduce the amount of UI state inside App.tsx and improve the feedback messages so unavailable results explain the exact reason more clearly.
