# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name: Dauren**
**Student ID: 24B031826**
**GitHub: impflaus**

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Gemini |
| Exact model (or "not displayed") | Gemini 3.6 Flash |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.12.7 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json

```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| `start` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | A model could send strings, fractions, negative values, or times outside the day. |
| `end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Invalid end times such as `"11:00"` or 1500 could reach the function. |
| `now` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | The current time could be missing or outside the expected minute range. |
| `blocked` | `"type": "boolean"` | A string such as `"false"` could be accepted even though it is not a real boolean. |
| `bookings` | `"type": "array"` with object items | The model could send a wrong structure such as `[660, 720]`. |
| booking item | `start` and `end` are required integers from 0 to 1440 | Incomplete booking objects such as `{start: 660}` could be accepted. |
| root object | all five fields are required | Calls missing fields such as `now` would pass schema validation. |
| root object | `"additionalProperties": false` | Extra fields such as `"room": "204"` would be silently accepted. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change; this was already a valid call. |
| S02 | PASS | PASS | No change; an empty bookings list is valid. |
| S03 | FAIL | PASS | Set `end` to type `integer`, so a string such as `"11:00"` is refused. |
| S04 | FAIL | PASS | Added all five fields to `required`, so a missing `now` is refused. |
| S05 | FAIL | PASS | Added `additionalProperties: false` to the root object, so an extra `room` field is refused. |
| S06 | FAIL | PASS | Added `minimum: 0` to minute fields, so negative start values are refused. |
| S07 | FAIL | PASS | Added `maximum: 1440` to minute fields, so values beyond the day are refused. |
| S08 | FAIL | PASS | Required both `start` and `end` inside every booking object. |
| S09 | FAIL | PASS | Set `blocked` to type `boolean`, so the string `"false"` is refused. |
| S10 | FAIL | PASS | Set minute fields to type `integer`, so fractional minutes such as 600.5 are refused. |
| S11 | PASS | PASS | No change; 1440 is a valid end-of-day value. |
| S12 | FAIL | PASS | Defined each booking as an object with `start` and `end`, so an array pair is refused. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->
R1 matched the request correctly. Gemini converted 9:00 to 540 minutes, 10:00 to 600, 11:00 to 660, and 12:00 to 720. It also correctly set blocked to false and represented the existing booking as {"start": 660, "end": 720}. The call matched the required check_room format and passed F1, F2 and F3.

### R2

```text
`canBook` returns `false`.

### Step-by-Step Evaluation

1. **Convert Time Inputs to Minutes from Midnight:**

* Current time (13:30) = 810 minutes
* Requested start (14:00) = 840 minutes
* Requested end (16:30) = 990 minutes

2. **Evaluate Constraints:**

* **Future Booking Constraint:** The requested start time is after the current time. **Pass**
* **Duration Constraint:** The requested duration is 150 minutes. **Fail**
* **Room Availability & Operational Status:** The room is blocked for maintenance. **Fail**

Because the requested duration exceeds the 120-minute limit and the room is blocked for maintenance, the booking request is rejected.
```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->
R2 did not follow the required tool-calling format. Gemini correctly converted 13:30 to 810, 14:00 to 840 and 16:30 to 990, but it did not call check_room. Instead, it evaluated the booking itself and returned false. This was the model's error because the request contained enough information for all five arguments. The model should have called check_room with start=840, end=990, now=810, blocked=true and bookings=[]. The final Available/Unavailable decision belongs to canBook, not the model.

### R3

```text
You cannot reserve the room for a couple of hours tomorrow afternoon.

Under the campus booking policy, single-session bookings are capped at a maximum duration of 120 minutes (2 hours), and your previous request for a 2.5-hour slot (14:00 to 16:30) was rejected for exceeding this limit. In addition, an active maintenance block is currently scheduled for that afternoon, keeping the room unavailable during those hours.
```

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? -->
R3 did not provide enough information for a valid check_room call. Exact start, end, now, blocked and bookings values were missing. Gemini should have asked a short clarification question instead of guessing. It did not make a tool call and instead introduced information from the previous R2 scenario, including the 14:00–16:30 interval and maintenance block. Those details were not present in R3, so the answer incorrectly reused information that should not have existed in a fresh chat.

## 5. What the schema cannot check

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->
The JSON Schema can check part of AC1: it can enforce that `start`, `end` and `now` are integers between 0 and 1440. However, with the allowed schema keywords it cannot compare the values of different fields.

AC1 can only be fully enforced by `canBook` because the function must check that `start < end` and that `start > now`. The schema can validate each number separately, but it cannot compare `start`, `end` and `now`.

AC2 can only be enforced by `canBook` because the function must calculate the booking duration and verify that `end - start <= 120`. The schema cannot calculate the difference between two fields.

AC3 can only be enforced by `canBook`. The schema can require `blocked` to be a boolean, but it cannot decide that a booking must be unavailable when `blocked` is `true`.

AC4 can only be enforced by `canBook` because checking overlap requires comparing the requested interval with every existing booking. The schema can validate the structure of `bookings`, but it cannot perform interval-overlap logic.

AC5 is enforced by the implementation and tool behavior, not by the input schema. The schema only validates input and cannot guarantee that the function does not modify or save data.

AC6 belongs to the user interface feedback, so it cannot be enforced by this tool input schema.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | This is a low-risk read-only availability check. The tool does not create or save a booking, so calling it with user-provided values does not modify repository or user data. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading source code is non-destructive and is needed to understand how `canBook` works. The main risk is exposure of source content, but this file is part of the local repository and contains implementation logic rather than credentials. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | This changes AC2 and the behavior of the application. A user request for a three-hour booking is not enough authority to modify an acceptance criterion, so explicit approval is required before changing the rule. |
| A4 | run `npm test` in `week-08/app` | allow | Running the test suite is normally non-destructive and is useful for verification. The risk is limited to local compute time and possible generated test artifacts. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | `git reset --hard` can permanently discard uncommitted work and move the branch history. It should require approval because the lost changes may not be recoverable easily. |
| A6 | `git commit` its change on the `week-09` branch | ask | A commit creates a permanent repository checkpoint and records the agent's changes in project history. I should review the diff and commit message before allowing it. |
| A7 | `git push` to `main` | block | Pushing directly to `main` bypasses review and can affect the shared remote branch. The assignment also requires work on `week-09` and an open PR instead of directly changing `main`. |
| A8 | send the contents of `.env` to an MCP server it found online | block | `.env` may contain passwords, API keys or other secrets. Sending those contents to an unknown external server would create a serious credential-exposure and data-leak risk. |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->
Before allowing an agent to edit the repository, I would use commit `b3c422f` as the checkpoint.
To return the repository to this checkpoint, I would run:

```bash
git reset --hard b3c422f

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
FAIL  F4    calls/r2.json: a call to check_room
             -> Expecting value: line 1 column 1 (char 0)
ERROR F5    calls/r2.json: arguments valid against your schema
             -> no readable call
ERROR F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
             -> no readable call
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 27 PASS · 1 FAIL · 2 ERROR  (of 30 checks)

```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->
F4, F5 and F6 still fail because Gemini did not produce a `check_room` tool call for R2. Instead, it evaluated the booking itself and returned a natural-language explanation. I kept `calls/r2.json` exactly as the model returned it, as required by the assignment, rather than editing the response to make the checker pass.

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->
This practice showed me that the schema, the model and the actual function have different responsibilities. The schema was useful for checking the structure of a call, for example rejecting S03 because `end` was a string and S05 because it contained an extra field. However, the schema cannot enforce business rules such as `start < end`, the 120-minute duration limit or booking overlap. Those rules belong to `canBook`.

The model can also fail even when the schema is correct. In R2, Gemini had all required information but evaluated the booking itself instead of calling `check_room`. In R3, it reused details that were not present in the request instead of asking for missing information. This showed me why agent permissions and human review are necessary even when a tool definition is strict.