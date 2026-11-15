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

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | | |
| A2 | read `week-08/app/src/booking.ts` | | |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | | |
| A4 | run `npm test` in `week-08/app` | | |
| A5 | run `git reset --hard` to undo its own last three edits | | |
| A6 | `git commit` its change on the `week-09` branch | | |
| A7 | `git push` to `main` | | |
| A8 | send the contents of `.env` to an MCP server it found online | | |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text

```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->
