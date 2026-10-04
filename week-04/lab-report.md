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
<paste, or write "none">
```

### 2.5 Critique prompt

```text
<paste>
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
| 1 | <issue> | <element> | <accept / reject> | <your reason> |
| 2 | <issue> | <element> | <accept / reject> | <your reason> |
| 3 | <issue> | <element> | <accept / reject> | <your reason> |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | <use case> | <classes and attributes> | <message, guard or decision> |
| R2 | <use case> | <classes, note> | <message, guard or decision> |
| R3 | <use case> | <classes and attributes> | <message, guard or decision> |
| R4 | <use case> | <classes> | <message or action> |
| <US-01> | <Book room> | <Student, Booking, Room> | <message or action> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <before> | <after> | <rule, story or notation reason> |
| 2 | <class> | <before> | <after> | <reason> |
| 3 | <sequence / activity> | <before> | <after> | <reason> |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
