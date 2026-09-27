# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name: Kaztay Dauren  
Student ID: 24B031826
GitHub username: impflaus

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | Claude |
| Exact model name and version | Claude Sonnet 5 |
| Date of the session | 27.09.2026 |
| Diagram renderer used | PlantUML Online Server |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
Here are 8 user stories based on the spec (covering all 6 UCs, staying within scope):

Student

UC-01 — As a Student, I want to view room availability for a given day, so that I can find a free slot before booking.
Priority: High · Assumption: Availability can be viewed with no limit on how far ahead a student may look.
UC-02 — As a Student, I want to book a free room for a future time slot, so that I have a guaranteed place to study.
Priority: High · Assumption: A booking that starts exactly when another one for the same room ends is not treated as an overlap (R3) — back-to-back bookings are allowed.
UC-02 — As a Student, I want the system to reject a booking longer than two hours, so that rooms stay available to other students.
Priority: High · Assumption: A booking of exactly two hours is allowed (R2 is an inclusive upper bound, not a strict "less than").
UC-03 — As a Student, I want to cancel a booking I made, so that the room becomes free for someone else if my plans change.
Priority: Medium · Assumption: A student can cancel only their own bookings, not bookings made by others.
UC-06 — As a Student, I want to receive a confirmation when my booking succeeds, so that I know the room is reserved for me.
Priority: Medium · Assumption: Confirmation is generated automatically right after a successful booking, with no separate approval step.
UC-06 — As a Student, I want to receive a confirmation when my cancellation goes through, so that I'm sure the room is no longer held under my name.
Priority: Low · Assumption: The cancellation confirmation is the same kind of message as a booking confirmation, just with a different status.

Administrator

UC-04 — As an Administrator, I want to block a room (e.g. it's out of service), so that students cannot book it while it's unusable.
Priority: High · Assumption: Blocking a room does not automatically cancel existing future bookings already made for it (R4 only prevents new bookings).
UC-05 — As an Administrator, I want to review room usage over a chosen period, so that I can see which rooms are over- or under-used.
Priority: Medium · Assumption: "Usage" means booking counts/durations per room over the period, not check-in or attendance data (out of scope).

Both open questions (R2 and R3) are settled in the assumptions of stories #2 and #3 — you can carry those straight into submission.yml. Note there's no dedicated unblock story (UC-04 covers both directions of blocking); if you need explicit coverage of unblocking, I can swap #6 (lowest priority) for a separate "unblock room" story.
```

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| As a Student, I want to view room availability for a given day, so that I can find a free slot before booking. | Changed the assumption only | The original assumption invented an unlimited look-ahead period that was not defined in the scenario. | US-01 |
| As a Student, I want to book a free room for a future time slot, so that I have a guaranteed place to study. | Kept unchanged | It matches UC-02 and R1. The assumption also resolves the open R3 question by allowing back-to-back bookings. | US-02 |
| As a Student, I want the system to reject a booking longer than two hours, so that rooms stay available to other students. | Rewritten | The original story focused on system validation instead of a Student goal. I rewrote it as a booking goal while keeping the two-hour rule. | US-03 |
| As a Student, I want to cancel a booking I made, so that the room becomes free again for someone else if my plans change. | Kept unchanged | It matches UC-03, uses the correct actor, and the assumption is consistent with the scenario because a student cancels a reservation they made. | US-04 |
| As a Student, I want to receive a confirmation when my booking succeeds, so that I know the room is reserved for me. | Changed the assumption only | The story matches UC-06, but the original assumption added a separate approval detail that is not defined in the scenario. | US-05 |
| As a Student, I want to receive a confirmation when my cancellation goes through, so that I'm sure the room is no longer held under my name. | Changed the assumption only | The story matches UC-06, but the original assumption added details about the confirmation format and status that are not defined in the scenario. | US-06 |
| As an Administrator, I want to block a room, so that students cannot book it while it is out of service. | Rewritten | The original story covered only blocking, while UC-04 also includes unblocking. Its assumption also invented behavior for existing bookings that the scenario does not define. | US-07 |
| As an Administrator, I want to review room usage over a chosen period, so that I can see which rooms are over- or under-used. | Changed the assumption only | The story matches UC-05, but the original assumption defined specific usage metrics that are not given in the scenario. | US-08 |

**Did the assistant invent anything outside the scenario?** Name it against the out-of-scope list in
README section 1, or write "no, and here is how I checked". 
```Yes. The assistant added some details that were not defined in the scenario, such as unlimited look-ahead for availability, a separate approval step, confirmation format/status, behavior of existing bookings when a room is blocked, and specific usage metrics. I removed or simplified these assumptions.```

**How many stories did you end with, and why that number?**
```I ended with 8 stories because the task allows 6–8 stories. Eight stories were enough to cover all six use cases while keeping booking rules and confirmation cases clear and separate.```

---

## 4. Original AI output — acceptance criteria (Part 3)

```
US-02 — Book a free room for a future time slot
Assumptions:

A booking that starts exactly when another booking for the same room ends is not an overlap (back-to-back allowed) — as given.
A booking of exactly two hours is allowed (R2 is an inclusive maximum, not a strict "less than").
AC1 (success): Given Room 204 has no booking between 14:00 and 16:00 today, when a student books Room 204 from 14:00 to 16:00, then the booking is created and the room is reserved for that slot.
AC2 (future-only validation, R1): Given the current time is 13:00, when a student tries to book Room 204 for 12:00–13:00 the same day, then the system rejects the booking because it does not start in the future.
AC3 (max duration, R2): Given a student selects a start time, when they request a duration of two hours and one minute, then the system rejects the booking for exceeding the maximum allowed duration.
AC4 (overlap, R3): Given Room 204 already has a booking from 10:00 to 12:00, when a student tries to book Room 204 from 11:00 to 13:00, then the system rejects the booking as overlapping.
AC5 (boundary case, alternative): Given Room 204 has a booking ending at 12:00, when a student books Room 204 starting at 12:00, then the booking is accepted, since a shared boundary is not treated as an overlap.

US-04 — Cancel a booking I made
Assumption: A student can cancel only their own bookings.

AC1 (success): Given a student has a confirmed future booking for Room 204, when they cancel it, then the booking is removed and the slot becomes available again.
AC2 (validation — not the owner): Given a booking for Room 204 belongs to another student, when the current student attempts to cancel it, then the system rejects the request.
AC3 (error — no such booking): Given a student references a booking ID that does not exist or was already cancelled, when they try to cancel it, then the system returns an error indicating the booking cannot be cancelled.
AC4 (alternative — availability update): Given a student cancels a future booking for Room 204, when the cancellation is processed, then the previously reserved time slot immediately shows as available in UC-01 (view availability).

US-07 — Block or unblock a room
Assumption: A blocked room cannot be booked (R4).

AC1 (success — block): Given Room 204 is currently unblocked, when an administrator blocks it, then the room's status changes to blocked and it no longer appears as bookable.
AC2 (success — unblock): Given Room 204 is currently blocked, when an administrator unblocks it, then the room's status changes to available and students can book it again.
AC3 (error — booking a blocked room, R4): Given Room 204 is blocked, when a student attempts to book it for any future time slot, then the system rejects the booking because the room is blocked.
AC4 (alternative — existing bookings untouched): Given Room 204 has an existing future booking, when an administrator blocks the room, then that existing booking is not automatically cancelled — blocking only prevents new bookings.
AC5 (validation — redundant action): Given Room 204 is already blocked, when an administrator attempts to block it again, then the system leaves its status unchanged and does not create a duplicate block state.
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| Given Room 204 has no booking between 14:00 and 16:00 today, when a student books Room 204 from 14:00 to 16:00, then the booking is created and the room is reserved for that slot. | The room number is invented and the criterion does not clearly state that the start time is in the future. | Given an unblocked room is free for a future two-hour time slot, when a Student books that room for the slot, then the booking is created and the room is reserved for that time. | AC-01 |
| Given the current time is 13:00, when a student tries to book Room 204 for 12:00–13:00 the same day, then the system rejects the booking because it does not start in the future. | The criterion correctly tests R1, but Room 204 is an invented detail not defined in the scenario. | Given the current time is 13:00, when a Student tries to book a room for 12:00–13:00 the same day, then the system rejects the booking because it does not start in the future. | AC-02 |
| Given a student selects a start time, when they request a duration of two hours and one minute, then the system rejects the booking for exceeding the maximum allowed duration. | The criterion tests R2 correctly, but the starting condition is too vague and does not isolate the duration rule clearly. | Given a Student selects an available unblocked room and a future start time, when they request a booking lasting two hours and one minute, then the system rejects the booking for exceeding the two-hour maximum. | AC-03 |
| Given Room 204 already has a booking from 10:00 to 12:00, when a student tries to book Room 204 from 11:00 to 13:00, then the system rejects the booking as overlapping. | The criterion tests R3 correctly, but Room 204 is invented and the times are not clearly stated as future times. | Given an unblocked room already has a future booking from 10:00 to 12:00, when a Student tries to book the same room from 11:00 to 13:00, then the system rejects the booking because the time slots overlap. | AC-04 |
| Given a room has a booking ending at 12:00, when a Student books the same room starting at 12:00, then the booking is accepted because a shared boundary is not treated as an overlap. | The criterion correctly tests the chosen R3 boundary assumption, but the original used an invented room number. | Given an unblocked room has a booking ending at 12:00, when a Student books the same room starting at 12:00 for a future time slot, then the booking is accepted because back-to-back bookings are allowed. | AC-05 |
| Given a student has a confirmed future booking for Room 204, when they cancel it, then the booking is removed and the slot becomes available again. | The criterion matches UC-03, but Room 204 is invented and the word confirmed adds an unnecessary detail. | Given a Student has their own future booking, when they cancel it, then the booking is cancelled and the time slot becomes available again. | AC-06 |
| Given a booking for Room 204 belongs to another student, when the current student attempts to cancel it, then the system rejects the request. | The criterion correctly checks booking ownership, but Room 204 is an invented detail. | Given a booking belongs to another Student, when the current Student attempts to cancel it, then the system rejects the cancellation request. | AC-07 |
| Given a student references a booking ID that does not exist or was already cancelled, when they try to cancel it, then the system returns an error indicating the booking cannot be cancelled. | The criterion includes a booking ID, which is a technical detail not defined in the scenario. | Given a Student tries to cancel a booking that does not exist or has already been cancelled, when the cancellation is requested, then the system rejects the request because there is no active booking to cancel. | AC-08 |
| Given a student cancels a future booking for Room 204, when the cancellation is processed, then the previously reserved time slot immediately shows as available in UC-01 (view availability). | The criterion uses an invented room number and adds an immediate update requirement that is not defined in the scenario. | Given a Student cancels their future booking, when the cancellation is processed, then the previously reserved time slot becomes available again for booking. | AC-09 |
| Given Room 204 is currently unblocked, when an administrator blocks it, then the room's status changes to blocked and it no longer appears as bookable. | The criterion uses an invented room number and describes how the room appears instead of focusing on the business behavior. | Given a room is unblocked, when an Administrator blocks it, then the room becomes blocked and students cannot make new bookings for it. | AC-10 |
| Given Room 204 is currently blocked, when an administrator unblocks it, then the room's status changes to available and students can book it again. | The criterion uses an invented room number and incorrectly treats unblocked as automatically available. | Given a room is blocked, when an Administrator unblocks it, then the room becomes unblocked and can be booked if it is otherwise available. | AC-11 |
| Given Room 204 has an existing future booking, when an administrator blocks the room, then that existing booking is not automatically cancelled — blocking only prevents new bookings. | The criterion invents behavior for existing bookings after a room is blocked. The scenario does not define what should happen to them. | Removed because the behavior is not supported by the scenario. | Removed |
| Given Room 204 is already blocked, when an administrator attempts to block it again, then the system leaves its status unchanged and does not create a duplicate block state. | The criterion invents behavior for repeating the same block action, which is not defined in the scenario. | Removed because the behavior is not supported by the scenario. | Removed |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed | The bookings do not share any actual time, so back-to-back bookings are allowed. |
| Is exactly two hours allowed under R2? | allowed | R2 says a booking lasts at most two hours, so exactly two hours is included. |

**Which invalid or boundary case did the assistant leave out?**
```The assistant did not test the exact R1 boundary where a booking starts at the current time. Since a booking must start in the future, a booking starting exactly now should be rejected.```

---

## 6. Original AI output — use-case diagram (Part 4)

```
@startuml SmartCampus_UseCaseDiagram
left to right direction
skinparam packageStyle rectangle

actor Student
actor Administrator

rectangle "Smart Campus Study Room Booking System" {
  usecase "View availability" as UC1
  usecase "Book room" as UC2
  usecase "Cancel booking" as UC3
  usecase "Block or unblock room" as UC4
  usecase "Review usage" as UC5
  usecase "Send confirmation" as UC6
}

' Actor associations (only justified ones)
Student -- UC1
Student -- UC2
Student -- UC3

Administrator -- UC4
Administrator -- UC5

' Include relationships (clear, mandatory sub-steps)
UC2 .> UC1 : <<include>>
UC2 .> UC6 : <<include>>
UC3 .> UC6 : <<include>>

@enduml
```

Rendered diagram (image, or a link): requirements/use-case.png

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| UC-02 <<include>> UC-01 | View availability was modeled as a mandatory included use case, but it is a separate Student goal and does not have to be triggered before every booking. | Removed the <<include>> relationship between UC-02 Book room and UC-01 View availability. |
| UC-02 <<include>> UC-06 | No problem. A successful booking requires confirmation according to UC-06. | Kept unchanged. |
| UC-03 <<include>> UC-06 | No problem. A successful cancellation requires confirmation according to UC-06. | Kept unchanged. |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.
```None. The assistant did not connect any actor directly to UC-06 Send confirmation. Student and Administrator associations match their responsibilities.```

**Did any screen, database or internal component appear as a use case or an actor?**
```No. The diagram contains only the two required actors and the six required business use cases.```

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them: none
- Stories with **no use case** they belong to: none
- Criteria that test **no rule** from section 1: AC-06, AC-07, AC-08, AC-09, AC-11

**What does the largest gap tell you about the generated requirements?**
```The largest gap is that UC-01, UC-05, and UC-06 have no acceptance criteria because criteria were created only for three selected stories. This is expected in this task, but these use cases do not have direct test coverage in the acceptance-criteria artifact.```

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py

(base) daurenkaztay@Noutbuk-Dauren week-03 % python tests/check_requirements.py
PASS   US-1  user-stories.md         no placeholders left
PASS   US-2  user-stories.md         8 stories, IDs US-01…US-08
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
PASS   US-7  user-stories.md         nothing from the out-of-scope list appears
PASS   AC-1  acceptance-criteria.md  no placeholders left
PASS   AC-2  acceptance-criteria.md  three sections, all naming real stories: US-02, US-04, US-07
PASS   AC-3  acceptance-criteria.md  every section has 3 to 5 uniquely numbered criteria
PASS   AC-4  acceptance-criteria.md  all 12 criteria are complete Given/When/Then
PASS   AC-5  acceptance-criteria.md  every section covers an invalid or boundary case
PASS   AC-6  acceptance-criteria.md  2 assumptions listed before the criteria
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
PASS   PU-1  use-cases.puml          valid PlantUML block, no placeholders
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found
PASS   TR-1  traceability.md         all six use cases have a row
PASS   TR-2  traceability.md         every ID in the table resolves
PASS   TR-3  traceability.md         every story appears in the table
------------------------------------------------------------------------
23 PASS · 0 FAIL · 0 ERROR   (23 checks)
Shape is clean. This says nothing about whether the requirements are good.
```

```
$ python tests/validate_submission.py

(base) daurenkaztay@Noutbuk-Dauren week-03 % python tests/validate_submission.py
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
PASS   student.name                              Kaztay Dauren
PASS   student.student_id                        24B031826
PASS   student.github                            impflaus
PASS   assistant.tool                            Claude
PASS   assistant.model                           Claude Sonnet 5
PASS   counts.user_stories                       8
PASS   counts.acceptance_criteria_sets           3
PASS   checker                                   23 PASS · 0 FAIL · 0 ERROR
NOTE   checker                                   you are claiming a clean run — it will be re-run at your commit, so make sure it is true
PASS   checker.commit                            a98a6b0
PASS   assumptions.overlap_touching_bookings     allowed
PASS   assumptions.exactly_two_hours             allowed
PASS   traceability.use_cases_not_covered        []
PASS   traceability.stories_not_traced           []
NOTE   traceability                              you are claiming full coverage in both directions — that is rare on a first pass, and it is checked
PASS   review_findings                           3 findings
PASS   review_findings[1]                        US-01 originally included an unlimited look-ahead assumption…
PASS   review_findings[2]                        US-03 focused on system rejection instead of a Student goal,…
PASS   review_findings[3]                        UC-01 was incorrectly included as a mandatory part of UC-02,…
PASS   honesty.can_explain_everything_submitted  yes
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
21 PASS · 0 FAIL · 0 ERROR · 2 note
Shape is fine. This says nothing about whether the work is good.
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | 23 | 0 | 0 |

Commit these numbers were produced at (`git rev-parse --short HEAD`): a98a6b0

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing. 
```No FAILs in the final checker run.```

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.
```No. I ran the checks with Python.```

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.

```
The most incorrect part of the generated requirements was not the general structure, but some assumptions and relationships that were added without support from the scenario. For example, the assistant added details about unlimited availability look-ahead, confirmation format, and the behavior of existing bookings when a room is blocked. It also modeled UC-01 View availability as a mandatory include for UC-02 Book room. Without the checker, I would catch these problems by comparing every story, criterion, and diagram element with the fixed scenario and the out-of-scope list.

The assistant did well in creating a clear first version of the requirements. It produced eight user stories with priorities and assumptions, covered all six use cases, and used the correct Student and Administrator roles. Doing this structure manually would take more time.

If I had to rewrite one requirement first before implementation, I would choose US-03. The original version focused on the system rejecting bookings longer than two hours instead of describing a Student goal. I rewrote it as a Student wanting to book a room for up to two hours, which is clearer for implementation and testing.
```
