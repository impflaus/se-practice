cat week-03/requirements/user-stories.md# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Dauren |
| Group | Monday 16:00-19:00 |
| AI assistant | Gemini |
| Exact model | Gemini 3.6 Flash |
| Renderer | <PlantUML web server |
| Behaviour diagram | activity |
| Stories used | my week-03 stories, revised |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
<paste>
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** <one line each, or "the AI listed none" — that is a finding too>

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | US-03: Validate Booking Duration | This is a system validation step, not a user goal. | US-03 / R1 | Removed it as a separate use case and treated the two-hour limit as a constraint of Book Room.|
| 2 | US-05: Send Booking Confirmation | Sending a confirmation is a system action/outcome, not a separate actor goal. | US-05 / R4 | Removed it as a separate use case and represented confirmation as the successful outcome of Book Room. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student – Booking | One student makes 0..* bookings. | Each booking belongs to exactly 1 student. | 1 / 0..* |
| Room – Booking | One room has 0..* bookings. | Each booking reserves exactly 1 room. | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: A note on the Booking class states that active bookings for the same room cannot overlap.
- R1: A note on the Booking class states that the start must be in the future and the duration must be greater than 0 and at most 2 hours.
- R3: A note on the Room class states that a blocked room cannot accept a new booking.

### 4.3 Assumptions

- A1: Blocking a room prevents new bookings only; existing bookings remain unchanged.
- A2: A booking that starts exactly when another booking for the same room ends is not considered an overlap.


### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Administrator–Room association | Multiplicity implies each room is managed by exactly one administrator, which is not stated. | US-07 | Removed the association; block/unblock remains an Administrator operation. |
| 2 | UsageReport | The class adds report IDs, utilization maps and persistent report objects not required by the story. | US-08 | Removed UsageReport and kept reviewRoomUsage() as an Administrator operation. |
| 3 | Room–Booking / Booking | R2 was not explicitly represented as a domain constraint. | R2 | Added a note stating that active bookings for the same room cannot overlap. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** <3A sequence / 3B activity — one sentence on why>

**Design components added beyond the domain model:** <name each one, e.g. `BookingService` —
what it does in one line; write "none" for an activity diagram>

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Duration <= 2 hours? | The AI checks only the maximum duration and does not check future start or duration > 0. | R1 | Replaced it with a full valid time range check. |
| 2 | Decision guards | The AI used (yes) / (no), but the required activity-diagram convention uses ([yes]) / ([no]). | PlantUML convention | Rewrote the guards in the required format. |
| 3 | existing confirmed booking | R2 refers to active bookings, but the AI narrowed the rule to confirmed bookings. | R2 | Changed the check to Overlaps active booking?. |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Booking confirmation was modeled with <<extend>>, although confirmation is mandatory after a successful booking. | Use-case diagram: Receive Booking Confirmation → Book Room | accept | R4 states that every successful booking produces a confirmation, so it should not look like optional extension behavior. I merged US-05 into Book Room and represented confirmation as its successful outcome. |
| 2 | Administrator should have dependency arrows to Room or Booking. | Class diagram: Administrator | reject | The approved stories do not define a structural Administrator–Room or Administrator–Booking relationship. The operations blockRoom() and unblockRoom() already represent US-07. |
| 3 | The class diagram does not explicitly show that a student can cancel only their own booking. | Class diagram: Booking / Student | accept | This constraint is explicitly stated in US-04, so I added it as a note on Booking. |
| 4 | The diagrams do not explicitly define what an active booking means for R2. | Class and activity diagrams: BookingStatus / overlap check | accept | Since the model contains CONFIRMED and CANCELLED statuses, I declared CONFIRMED bookings as active and CANCELLED bookings as non-blocking. |
| 5 | US-06 is missing. | Approved stories and all diagrams | reject | US-06 was intentionally removed from the revised Week 03 story set. I preserved the original IDs, so US-07 and US-08 were not renumbered. |
| 6 | Student operations should be moved to a service/controller class. | Class diagram: Student | reject | The task asks for a domain class diagram and does not justify introducing a service/controller class. Adding one would introduce an unnecessary design element. |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Room (US-02, US-03, US-05) | Booking: startTime, endTime; R1 note | Valid time range? (R1) |
| R2 | Book Room (US-02, US-03, US-05) | Room–Booking association; Booking R2 note | Overlaps active CONFIRMED booking? (R2) |
| R3 | Book Room (US-02, US-03, US-05) | Room: isBlocked; R3 note | Room blocked? (R3) |
| R4 | Book Room (US-02, US-03, US-05) | Booking | Send booking confirmation (R4) |
| US-01 | View Room Availability (US-01) | Student, Room | Student selects room and time slot |
| US-02 | Book Room (US-02, US-03, US-05) | Student, Booking, Room | Create booking |
| US-03 | Book Room (US-02, US-03, US-05) | Booking: startTime, endTime | Valid time range? (R1) |
| US-04 | Cancel Own Booking (US-04) | Student, Booking; ownership note | Not part of the Book Room activity diagram |
| US-05 | Book Room (US-02, US-03, US-05) | Booking | Send booking confirmation (R4) |
| US-07 | Block / Unblock Room (US-07) | Administrator, Room | Room blocked? (R3) |
| US-08 | Review Room Usage (US-08) | Administrator | Not part of the Book Room activity diagram |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Validate Booking Duration was a separate use case and Booking Confirmation was modeled separately. | Book Room now covers US-02, US-03 and US-05, with booking rules represented as constraints and outcomes. | US-03 is a booking constraint, not a separate user goal, and R4 requires confirmation after success. |
| 2 | class | The AI added UsageReport and an unjustified Administrator to Room association, and R2 was not shown as a note. | UsageReport and the unjustified association were removed, and notes were added for the booking constraints. | Only requirements-supported domain concepts should be modeled, and R2 must be stated explicitly. |
| 3 | activity | The AI checked only the two-hour maximum and did not fully represent R1. | The revised activity has separate checks for R1, R3 and R2 before booking creation. | The activity requirements require three separate guarded decisions before creating a booking. |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (5 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (3 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  4 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  5 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  7 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story

SUMMARY pass=35 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>

```
The class diagram was the diagram the AI got most wrong. It added a UsageReport class with fields such as reportId and roomUtilizationMap even though US-08 only says that an administrator should review room usage. It also created an Administrator–Room association that suggested a structural relationship not required by the stories. If these decisions had reached the code, the system could have contained unnecessary classes and relationships.

The critique found one issue that I had not made explicit enough: US-04 says that a student can cancel only their own booking, so I added this constraint to the class diagram. It also helped me clarify that CONFIRMED bookings are treated as active for the R2 overlap check. However, the critique incorrectly claimed that US-06 was missing by mistake. US-06 was intentionally removed from my revised Week 03 stories, while I kept the original IDs for US-07 and US-08.
```
