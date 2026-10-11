# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.1

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

<!-- 100–150 words, labels included. One small scenario, used in every prompt and in your
     whole answer. Anything fictional is labelled in Assumptions. -->

**Question:** What should a food delivery company receive besides working program code for its ordering system to be considered professionally delivered?

**Users:** Customers who place food orders, restaurant staff who receive and prepare them, and delivery staff who handle deliveries.

**Problem:** The company wants one system that lets customers order food online, sends orders to restaurants, and helps staff track the order from placement to delivery.

**Constraints:** The system must be easy to use on mobile devices, and order information must remain accurate while different users update the order status.

**Risk:** A software defect could create an incorrect order or status, causing the restaurant to prepare the wrong food or the delivery to go to the wrong customer.

**Assumptions:** The company, restaurants, delivery workflow, project budget, technical infrastructure, and business rules in this scenario are fictional and are used only for this assignment.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

Professional software delivery means giving the customer more than working program code. For the food delivery ordering system, the delivered product should include documentation, test evidence, user guidance, and support information that make the system usable and maintainable after release. Sommerville explains that professional software includes not only programs but also associated documentation, configuration data, and other information needed to make the software useful. He also states that software engineering covers the full lifecycle from specification to operation and maintenance.

The first engineering decision is to provide a clear order-flow specification instead of only general system documentation. The food delivery platform has several user roles, and each role may update the status of an order. A state-transition description such as Placed, Preparing, Out for Delivery, and Delivered gives developers and operators a common definition of valid order states. This is important because the main risk in the scenario is an incorrect order or status update. Clear documentation reduces ambiguity when the system is tested, maintained, or changed later.

The second engineering decision is to provide validation and test evidence that is appropriate to the system rather than requiring one fixed set of test types. The original AI draft stated that unit, integration, and end-to-end testing were universally required. After checking Sommerville, this claim was qualified. The source describes staged validation, including component, system, and customer testing, but the exact approach depends on the type of software. For this scenario, the most important evidence should show that order creation, status changes, and conflicting updates behave correctly.

Another important deliverable is role-specific guidance. Customers, restaurant staff, and delivery staff perform different tasks, so one generic manual would be less useful. The company should receive simple instructions that match each role. The final delivery should also include a maintenance and support plan because professional software continues to change after release. This is especially relevant when restaurants update menus, bugs are discovered, or delivery requirements change.

There is a trade-off between delivery speed and the amount of documentation and testing. More evidence and documentation require additional time, but reducing them too much increases the risk of operational errors and expensive maintenance later.

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

Prompt B identified several problems in the first draft. The most important issue was that the draft treated specific testing types as universal requirements. I accepted this criticism because the scenario only required test evidence, not a fixed testing framework. Verification row 1 confirmed that Sommerville describes staged validation and testing, but the exact form depends on the type of software. Therefore, I qualified the claim and changed the final analysis to require validation and test evidence appropriate to the food delivery system.

The critique also correctly identified unsupported scope additions. The first draft mentioned payment details even though payment processing was not part of the scenario. I accepted this point and removed the payment example in change-log row 2. This keeps the analysis focused on the actual risks described in the scenario, especially incorrect order data and status updates.

Another useful criticism was that some deliverables were too vague. The draft referred generally to architectural documentation and ongoing support. I revised these ideas by introducing a concrete order-flow specification, state-transition information, role-specific user guidance, and a maintenance and support plan. Change-log row 1 also strengthened the testing section by linking validation evidence directly to conflicting order-status updates.

Verification row 2 supported the maintenance decision. Sommerville explains that professional software is maintained and changed throughout its life and that software engineering includes operation and maintenance. I therefore kept the claim that post-release support is part of professional delivery, but expressed it as a concrete maintenance and support deliverable.

Overall, Prompt B was useful because it exposed over-specific claims and unsupported assumptions. The final version is narrower, better connected to the scenario, and more clearly focused on tangible deliverables.

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

For this food delivery ordering system, professional delivery should include more than working source code. The company should receive clear order-flow documentation, validation and test evidence, role-specific user guidance, operational procedures, and a maintenance and support plan. These deliverables directly address the main scenario risks, especially incorrect order data and conflicting status updates. They also make the system easier to operate, verify, and maintain after release.

The main limitation is that the scenario does not define the full technical architecture or support responsibilities. For example, it does not specify how order updates are synchronized or which maintenance tasks belong to the developer after handover. Therefore, the recommended delivery package should stay focused on documented requirements and operational needs without inventing unsupported technical details.

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

This assignment showed me that AI can produce a useful first draft, but the draft still needs careful checking. Prompt A helped me organize the main ideas about professional software delivery, especially documentation, testing, user guidance, and maintenance. However, Prompt B was more useful because it showed where the first answer became too specific or added assumptions that were not part of my scenario.

The biggest change I made was in the testing section. At first, the draft presented unit, integration, and end-to-end testing as universal requirements. After checking Sommerville, I changed this to validation and test evidence appropriate to the type of system. I also removed the reference to payment details because payment processing was not included in the scenario.

I learned that a strong software engineering answer should stay close to the actual problem and distinguish evidence from assumptions. I also learned that professional software delivery includes more than code, because documentation, testing evidence, user instructions, and maintenance information are needed after the program is delivered.

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- - Sommerville, I. (2016). *Software Engineering*, 10th ed., Global Edition. Pearson. Chapters 1–2.

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

1. Working code alone is not enough because the company also needs clear requirements and documentation for operating the food delivery system.
2. The delivered system should include test evidence for important actions such as placing an order, updating its status, and preventing incorrect order data.
3. Customers, restaurant staff, and delivery staff need simple instructions because they use different parts of the same system.
4. The company needs maintenance and support after release because bugs, restaurant changes, and new delivery requirements may appear later.
5. Deployment, backup, recovery, and security information are also important so the company can keep the service running and recover from failures.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** Gemini 
- **Model:** Gemini 3.6 Flash
- **Date:** 2026-10-11
- **Purpose:** contextual draft

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.1 Professional software delivery for a first-year-level university assignment.

My scenario is customers place food orders, restaurant staff receive and prepare them, and delivery staff handle deliveries. The company wants one system that lets customers order food online, sends orders to restaurants, and helps staff track the order from placement to delivery. The system must be easy to use on mobile devices, and order information must remain accurate while different users update the order status. A software defect could create an incorrect order or status, causing the restaurant to prepare the wrong food or the delivery to go to the wrong customer. My initial ideas are: 1. Working code alone is not enough because the company also needs clear requirements and documentation for operating the food delivery system. 2. The delivered system should include test evidence for important actions such as placing an order, updating its status, and preventing incorrect order data. 3. Customers, restaurant staff, and delivery staff need simple instructions because they use different parts of the same system. 4. The company needs maintenance and support after release because bugs, restaurant changes, and new delivery requirements may appear later. 5. Deployment, backup, recovery, and security information are also important so the company can keep the service running and recover from failures. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Here is a breakdown and structured draft tailored for a first-year software engineering assignment on **Topic 1.1: Professional Software Delivery**.

---

### Draft Explanation (450 Words)

In professional software delivery, a working application alone is insufficient to guarantee business success and operational reliability. Software engineering encompasses not just programming, but the complete set of activities, documentation, and processes required to build, deploy, and maintain a high-quality system over time.

In a multi-user food delivery platform—serving customers, restaurant staff, and delivery drivers—order status accuracy is critical. A system defect, such as misrouting an address or miscalculating order items, directly causes financial loss and customer dissatisfaction. To prevent this, software delivery must adhere to structured engineering principles across five main areas:

1. **System Documentation & Requirements:** Beyond source code, the project requires explicit functional requirements and architectural documentation. Clear specification of state transitions (e.g., *Placed* $\rightarrow$ *Preparing* $\rightarrow$ *Out for Delivery* $\rightarrow$ *Delivered*) ensures developers and stakeholders share a common understanding of order behavior.
2. **Quality Assurance & Verification:** Test evidence—including unit tests, integration tests, and end-to-end validation—is essential before release. Automated testing must verify that concurrent updates from drivers and kitchen staff do not overwrite order data or violate business logic.
3. **Role-Specific User Guidance:** Because customers, kitchen managers, and drivers interact with distinct mobile interface modules, concise user documentation and onboarding guides are required to minimize human error during daily operations.
4. **Evolution & Maintenance:** Post-release support is integral to software delivery. As restaurants adjust menus or new local delivery regulations emerge, the system must undergo ongoing maintenance, bug fixing, and regular feature updates.
5. **Operational Infrastructure & Security:** Professional delivery covers deployment pipelines, automated database backups, disaster recovery protocols, and data protection (e.g., protecting customer addresses and payment details). These measures ensure high availability and operational resilience against failures.

---

### Software Engineering Analysis

#### 1. Facts vs. Assumptions

* **Facts (Explicit in Scenario):**
* The system involves three distinct user groups: customers, restaurant staff, and delivery personnel.
* System updates happen concurrently across mobile interfaces.
* System errors lead to tangible real-world consequences (wrong meals cooked or delivered to wrong locations).


* **Assumptions (Implicit / Added Nuance):**
* The application relies on a centralized cloud backend or database to synchronize real-time updates.
* Mobile network connectivity may be spotty for drivers on the road, requiring offline handling or reconnection state management.



#### 2. Key Trade-Offs

* **Comprehensive Documentation vs. Delivery Speed:** Writing exhaustive documentation slows down initial launch speed, but skipping it increases long-term technical debt and maintenance costs.
* **Rigorous Testing vs. Time-to-Market:** Running thorough automated test suites delays feature rollouts, but insufficient testing risks costly production bugs and lost customer trust.

#### 3. Claims to Verify with Course Materials

* Check your course textbook (e.g., Ian Sommerville's *Software Engineering*) for the exact university definition of **Professional Software Development** vs. **Programing**.
* Verify whether your syllabus explicitly defines software products as including *programs, documentation, user manuals, and configuration data*.
```

### B2 — Critique (Prompt B)

- **Tool:** Gemini
- **Model:** Gemini 3.6 Flash
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft 

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: What should a food delivery company receive besides working program code for its ordering system to be considered professionally delivered? Scenario: Customers place food orders, restaurant staff receive and prepare them, and delivery staff handle deliveries. The company wants one system that lets customers order food online, sends orders to restaurants, and helps staff track the order from placement to delivery. The system must be easy to use on mobile devices, and order information must remain accurate while different users update the order status. A software defect could create an incorrect order or status, causing the restaurant to prepare the wrong food or the delivery to go to the wrong customer. Draft: Here is a breakdown and structured draft tailored for a first-year software engineering assignment on Topic 1.1: Professional Software Delivery.

### Draft Explanation (450 Words)

In professional software delivery, a working application alone is insufficient to guarantee business success and operational reliability. Software engineering encompasses not just programming, but the complete set of activities, documentation, and processes required to build, deploy, and maintain a high-quality system over time.

In a multi-user food delivery platform—serving customers, restaurant staff, and delivery drivers—order status accuracy is critical. A system defect, such as misrouting an address or miscalculating order items, directly causes financial loss and customer dissatisfaction. To prevent this, software delivery must adhere to structured engineering principles across five main areas:

1. **System Documentation & Requirements:** Beyond source code, the project requires explicit functional requirements and architectural documentation. Clear specification of state transitions (e.g., *Placed* → *Preparing* → *Out for Delivery* → *Delivered*) ensures developers and stakeholders share a common understanding of order behavior.
2. **Quality Assurance & Verification:** Test evidence—including unit tests, integration tests, and end-to-end validation—is essential before release. Automated testing must verify that concurrent updates from drivers and kitchen staff do not overwrite order data or violate business logic.
3. **Role-Specific User Guidance:** Because customers, kitchen managers, and drivers interact with distinct mobile interface modules, concise user documentation and onboarding guides are required to minimize human error during daily operations.
4. **Evolution & Maintenance:** Post-release support is integral to software delivery. As restaurants adjust menus or new local delivery regulations emerge, the system must undergo ongoing maintenance, bug fixing, and regular feature updates.
5. **Operational Infrastructure & Security:** Professional delivery covers deployment pipelines, automated database backups, disaster recovery protocols, and data protection (e.g., protecting customer addresses and payment details). These measures ensure high availability and operational resilience against failures.

### Software Engineering Analysis

#### 1. Facts vs. Assumptions

- **Facts (Explicit in Scenario):**
  - The system involves three distinct user groups: customers, restaurant staff, and delivery personnel.
  - System updates happen concurrently across mobile interfaces.
  - System errors lead to tangible real-world consequences (wrong meals cooked or delivered to wrong locations).
- **Assumptions (Implicit / Added Nuance):**
  - The application relies on a centralized cloud backend or database to synchronize real-time updates.
  - Mobile network connectivity may be spotty for drivers on the road, requiring offline handling or reconnection state management.

#### 2. Key Trade-Offs

- **Comprehensive Documentation vs. Delivery Speed:** Writing exhaustive documentation slows down initial launch speed, but skipping it increases long-term technical debt and maintenance costs.
- **Rigorous Testing vs. Time-to-Market:** Running thorough automated test suites delays feature rollouts, but insufficient testing risks costly production bugs and lost customer trust.

#### 3. Claims to Verify with Course Materials

- Check your course textbook (e.g., Ian Sommerville's Software Engineering) for the exact university definition of Professional Software Development vs. Programing.
- Verify whether your syllabus explicitly defines software products as including programs, documentation, user manuals, and configuration data.
```

**Response:**

```text
### Critical Review & Evaluation of the Draft

---

### 1. Inaccuracies & Over-Scoped Engineering Concepts

#### A. Over-specifying Automated Testing Frameworks

* **Concern:** Point 2 of the draft explicitly emphasizes *"Automated testing"* and *"unit, integration, and end-to-end validation."* The original scenario and point 2 only ask for "test evidence for important actions."
* **Why it matters:** In a first-year introduction to software engineering, over-specifying automated test pipelines introduces concepts that go beyond fundamental software delivery definitions (e.g., Somerville/Pressman models). The deliverable required by the client is test *evidence* (logs, test cases, compliance records), not necessarily an automated test pipeline.
* **How to check:** Check your lecture slides on Topic 1.1 or Software Quality Assurance to see if manual test execution logs and acceptance test sign-offs are considered valid deliverables alongside test code.
* **Counterexample / Alternative:** A startup might deliver manual acceptance test sign-offs recorded in a simple test matrix sheet rather than maintaining automated CI/CD unit testing scripts.

#### B. Premature Inclusion of Security & Infrastructure Requirements

* **Concern:** Point 5 mentions *"payment details," "deployment pipelines,"* and *"disaster recovery protocols."* Payment processing is not mentioned in the prompt scenario.
* **Why it matters:** Adding unstated functional features (e.g., payment gateways) changes the scope of what constitutes "professional delivery" for this specific problem context.
* **How to check:** Review the exact prompt wording. If payment handling is not specified, focus strictly on user data protection and order state consistency.
* **Counterexample / Alternative:** The food delivery platform could operate on a "pay-on-delivery" or external invoice basis, making payment gateway security irrelevant to this system's initial delivery scope.

---

### 2. Missing Reasoning & Unexplained Connections

#### A. Disconnect Between Concurrency Risks and Deliverables

* **Concern:** The draft notes that concurrent updates could overwrite data, but it does not clearly connect *what deliverable* addresses this issue.
* **Why it matters:** The core question asks what the company should **receive** besides source code. Simply stating that race conditions exist doesn't explain what artifact prevents or documents them.
* **How to check:** Ask yourself: *"What explicit deliverable proves to the company that concurrent updates were accounted for?"*
* **Counterexample / Alternative:** The necessary deliverable is a **State Transition Diagram** or **Concurrency Control Design Document**, paired with stress-test evidence showing two users updating the same order simultaneously without data corruption.

#### B. Unlinked Maintenance Strategy

* **Concern:** Point 4 states that the company needs support for bugs and menu changes, but does not identify the deliverable required at hand-off.
* **Why it matters:** "Support" is an ongoing activity, whereas a professional delivery artifact is concrete (e.g., a Service Level Agreement [SLA] or Maintenance & Configuration Manual).
* **How to check:** Look at software lifecycle definitions in your textbook to differentiate between the *Phase* (Evolution/Maintenance) and the *Deliverable* (Maintenance Plan / Operations Guide).
* **Counterexample / Alternative:** Instead of vague "support," the company receives a **System Reconfiguration Guide** that allows restaurant staff to update menu items independently without requiring software engineers to modify source code.

---

### 3. Vague Claims & Broad Language

#### A. Ambiguous Definition of "System Documentation"

* **Concern:** Point 1 lists *"explicit functional requirements and architectural documentation"* without grounding them in the food delivery scenario.
* **Why it matters:** First-year grading rubrics reward applying generic concepts to the provided scenario. Abstract terms like "architectural documentation" sound generic.
* **How to check:** Ensure every document type mentioned is tied directly to a scenario requirement (e.g., data models for order states, user roles, or mobile screen layouts).
* **Counterexample / Alternative:** Replace "architectural documentation" with **Data Flow Diagrams (DFDs)** showing how an order moves from the customer app to the restaurant kitchen terminal and driver app.

#### B. Loose Framing of "Role-Specific User Guidance"

* **Concern:** Point 3 uses vague terminology like *"concise user documentation and onboarding guides."*
* **Why it matters:** The customer, restaurant manager, and delivery driver have entirely different environments (e.g., driver on a bike vs. chef in a busy kitchen). Broad guidance claims ignore environmental constraints.
* **How to check:** Match user documentation deliverables to specific interface roles: Customer Quick-Start Guide, Kitchen Display System Operator Manual, and Driver Mobile Application Guide.
* **Counterexample / Alternative:** Drivers do not need a full user manual; they need a 1-page mobile workflow cheat sheet or contextual in-app tooltips due to high turnover and limited training time.

---

### 4. Unsupported Assumptions in the Analysis Section

#### A. Claiming "Concurrent Updates Across Mobile Interfaces" is a Direct Fact

* **Concern:** Under *Facts vs. Assumptions*, the draft lists *"System updates happen concurrently across mobile interfaces"* as a fact.
* **Why it matters:** The scenario states: *"order information must remain accurate while different users update the order status."* It does not state that users access the system purely through mobile interfaces (kitchen staff might use a fixed desktop POS terminal or dedicated kitchen display monitor).
* **How to check:** Re-read the scenario carefully: *"The system must be easy to use on mobile devices"* applies to accessibility, but does not rule out dedicated hardware terminals for restaurants.
* **Counterexample / Alternative:** Restaurant staff might interact with a stationary kitchen display screen connected via local Ethernet, while only customers and delivery drivers use mobile devices over cellular networks.

#### B. Assuming "Centralized Cloud Backend"

* **Concern:** Under *Assumptions*, the analysis mentions a *"centralized cloud backend."*
* **Why it matters:** While standard today, software delivery analysis shouldn't assume modern cloud architecture unless specified. It could be hosted on a local on-premise server or managed database instance.
* **How to check:** Distinguish between general software engineering principles (independent of architecture) and specific deployment setups.

---

### Key Questions to Address Before Drafting the Final Version

1. **Course Definitions:** Does your course textbook (e.g., Sommerville Chapter 1) explicitly list the 4 components of a software product (Programs, Documentation, Operating Procedures, Data)?
2. **Deliverable Focus:** Can every point in your draft be rephrased as a tangible *artifact* handed over to the client (e.g., User Manual, Deployment Script, Test Log, SLA)?
```

### B3 — Revision (Prompt C)

- **Tool:** Gemini
- **Model:** Gemini 3.6 Flash
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: 
Accepted:
1. The draft over-specified testing by presenting unit, integration, and end-to-end testing as universally required. I will qualify this and describe testing more generally as validation and test evidence appropriate to the system.
2. The draft introduced payment details even though payment processing was not part of the scenario. I will remove that example.
3. The draft did not clearly connect concurrency risk to a concrete deliverable. I will add a state-transition or order-flow specification plus test evidence for conflicting status updates.
4. The maintenance point was too vague. I will make the handover more concrete by referring to a maintenance/support plan and operational guidance.
5. “Architectural documentation” was too generic. I will tie documentation to the actual order flow, user roles, and order-status behavior.
6. The draft treated all user guidance too broadly. I will make the guidance role-specific for customers, restaurant staff, and delivery staff.
7. The statement that all updates happen across mobile interfaces was too strong. I will qualify it because restaurant staff may use a fixed terminal.
8. The centralized cloud backend was an unsupported architectural assumption. I will remove it from the final analysis.


Verified evidence: 
Verified evidence:
- Sommerville, Chapter 2, §2.2.3 Software validation, pp. 58–59: validation and staged testing are important, but the exact set of test types depends on the system. Decision: qualify.
- Sommerville, Chapter 1, §1.1 Professional software development, pp. 19–23: professional software is maintained and changed throughout its life, and software engineering includes operation and maintenance. Decision: keep.


Draft: 
Here is a breakdown and structured draft tailored for a first-year software engineering assignment on Topic 1.1: Professional Software Delivery.

Draft Explanation (450 Words)
In professional software delivery, a working application alone is insufficient to guarantee business success and operational reliability. Software engineering encompasses not just programming, but the complete set of activities, documentation, and processes required to build, deploy, and maintain a high-quality system over time.

In a multi-user food delivery platform—serving customers, restaurant staff, and delivery drivers—order status accuracy is critical. A system defect, such as misrouting an address or miscalculating order items, directly causes financial loss and customer dissatisfaction. To prevent this, software delivery must adhere to structured engineering principles across five main areas:

1. System Documentation & Requirements: Beyond source code, the project requires explicit functional requirements and architectural documentation. Clear specification of state transitions (e.g., Placed $\rightarrow$ Preparing $\rightarrow$ Out for Delivery $\rightarrow$ Delivered) ensures developers and stakeholders share a common understanding of order behavior.
2. 
3. Quality Assurance & Verification: Test evidence—including unit tests, integration tests, and end-to-end validation—is essential before release. Automated testing must verify that concurrent updates from drivers and kitchen staff do not overwrite order data or violate business logic.
4. 
5. Role-Specific User Guidance: Because customers, kitchen managers, and drivers interact with distinct mobile interface modules, concise user documentation and onboarding guides are required to minimize human error during daily operations.
6. 
7. Evolution & Maintenance: Post-release support is integral to software delivery. As restaurants adjust menus or new local delivery regulations emerge, the system must undergo ongoing maintenance, bug fixing, and regular feature updates.
8. 
9. Operational Infrastructure & Security: Professional delivery covers deployment pipelines, automated database backups, disaster recovery protocols, and data protection (e.g., protecting customer addresses and payment details). These measures ensure high availability and operational resilience against failures.
10. 
Software Engineering Analysis
1. Facts vs. Assumptions
- Facts (Explicit in Scenario):
- 
  - The system involves three distinct user groups: customers, restaurant staff, and delivery personnel.
  - 
  - System updates happen concurrently across mobile interfaces.
  - 
  - System errors lead to tangible real-world consequences (wrong meals cooked or delivered to wrong locations).
  - 
- Assumptions (Implicit / Added Nuance):
- 
  - The application relies on a centralized cloud backend or database to synchronize real-time updates.
  - 
  - Mobile network connectivity may be spotty for drivers on the road, requiring offline handling or reconnection state management.
  - 
2. Key Trade-Offs
- Comprehensive Documentation vs. Delivery Speed: Writing exhaustive documentation slows down initial launch speed, but skipping it increases long-term technical debt and maintenance costs.
- 
- Rigorous Testing vs. Time-to-Market: Running thorough automated test suites delays feature rollouts, but insufficient testing risks costly production bugs and lost customer trust.
- 
3. Claims to Verify with Course Materials
- Check your course textbook (e.g., Ian Sommerville's Software Engineering) for the exact university definition of Professional Software Development vs. Programing.
- 
- Verify whether your syllabus explicitly defines software products as including programs, documentation, user manuals, and configuration data.


Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
Here is the revised assignment draft and analysis, followed by a summary of all changes made based on your review decisions and verified evidence from Sommerville.

---

### Revised Explanation (400–500 Words)

In professional software delivery, program code alone is insufficient to ensure operational success and business reliability. Software engineering encompasses the complete set of activities, documentation, and procedures required to build, deploy, operate, and maintain a system throughout its lifecycle.

In a multi-user food ordering platform serving customers, restaurant staff, and delivery drivers, order status accuracy is critical. A software defect—such as an unhandled status conflict or corrupted order details—causes tangible real-world harm, including preparing incorrect meals or delivering orders to wrong addresses. To prevent such failures and ensure professional delivery, the company must receive key non-code deliverables:

1. **System Documentation & Order-Flow Specifications:** Beyond source code, the company needs explicit functional requirements and a clear state-transition specification (e.g., *Placed* $\rightarrow$ *Preparing* $\rightarrow$ *Out for Delivery* $\rightarrow$ *Delivered*). Documenting these state transitions ensures developers and operators share a single source of truth for how order statuses update.
2. **Quality Assurance & Test Evidence:** To mitigate concurrency risks when drivers and kitchen staff update order statuses simultaneously, the deliverable must include test records and validation logs. This evidence demonstrates that state transitions were systematically verified under conflicting status updates, using test approaches tailored to the platform's requirements.
3. **Role-Specific User Guidance:** Because customers, kitchen staff, and drivers interact with different functional workflows, the system requires tailored user manuals and operational guides (e.g., kitchen display guides vs. driver mobile instructions) to minimize human operational errors.
4. **Maintenance & Support Plan:** Professional software requires ongoing modification after release. The company needs a formal support plan outlining protocols for bug fixing, menu configuration updates, and adapting to evolving delivery requirements over time.
5. **Operational, Backup & Recovery Procedures:** Deliverables must include deployment guides, database backup routines, disaster recovery procedures, and security guidelines for customer personal data. These procedures ensure high service availability and rapid recovery from operational failures.

---

### Software Engineering Analysis

#### 1. Facts vs. Assumptions

* **Facts (Explicit in Scenario):**
* The system serves three distinct user roles: customers, restaurant staff, and delivery personnel.
* The application must support mobile usage and track orders across different users updating status information.
* System defects cause immediate physical and operational errors (wrong food cooked, wrong delivery recipient).


* **Assumptions & Uncertainties:**
* **Device Hardware:** While mobile compatibility is required, restaurant staff may interact with the system using fixed kitchen terminals or desktop point-of-sale (POS) displays rather than handheld mobile devices.
* **Network Handling:** Delivery drivers on the road may encounter temporary cellular disconnects, which could require offline state handling or reconnection handling, depending on backend network behavior.



#### 2. Key Trade-Offs

* **Comprehensive Documentation vs. Delivery Speed:** Producing detailed state-transition models and operational guides increases initial delivery time, but omitting them leads to higher long-term maintenance costs and operational confusion.
* **Rigorous Staged Testing vs. Release Time:** Conducting thorough validation testing delays initial market release, but launching without test evidence risks severe financial loss and customer dissatisfaction from order corruption.

#### 3. Claims & Evidence Verification

* **Sommerville (Chapter 2, §2.2.3, pp. 58–59):** Confirms that software validation and staged testing are essential, but notes that the specific types and depth of testing depend directly on the nature of the system being built.
* **Sommerville (Chapter 1, §1.1, pp. 19–23):** Establishes that professional software development extends beyond initial coding to include long-term operation, maintenance, and system evolution over time.

---

### Summary of Changes & Audit Trail

| Section | Original Draft | Revision | Reason / Decision |
| --- | --- | --- | --- |
| **Testing Scope** | Listed unit, integration, and end-to-end testing as strict universal requirements. | Qualified as general validation, test records, and validation logs appropriate to the system. | **Decision 1 & Sommerville §2.2.3:** Prevents over-specifying rigid test suites where general test evidence is required. |
| **Security Examples** | Referenced customer payment details and payment gateways. | Removed payment references; focused strictly on customer personal data (e.g., addresses). | **Decision 2:** Scenario does not mention payment processing. |
| **Concurrency Deliverable** | Noted race condition risks without specifying an artifact. | Explicitly linked concurrency risk to state-transition models and test evidence for conflicting updates. | **Decision 3:** Directly connects operational risk to a concrete deliverable handed to the client. |
| **Maintenance Handover** | Vaguely described "ongoing maintenance, bug fixing, and regular feature updates." | Framed handover around a concrete **Maintenance & Support Plan** and operational procedures. | **Decision 4 & Sommerville §1.1:** Converts an ongoing activity into a deliverable artifact. |
| **System Documentation** | Referred broadly to "architectural documentation." | Focused on **Order-Flow Specifications** and state-transition models. | **Decision 5:** Ties documentation directly to scenario domain rules. |
| **User Guidance** | Broadly cited "concise user documentation and onboarding guides." | Contextualized as **Role-Specific User Guidance** (e.g., kitchen display vs. driver mobile instructions). | **Decision 6:** Reflects distinct environmental needs across customer, restaurant, and delivery roles. |
| **Mobile Usage Assumption** | Claimed all updates happen concurrently "across mobile interfaces." | Qualified statement; noted restaurant staff may use stationary kitchen displays or POS terminals. | **Decision 7:** Eliminates unsupported assumption about restaurant hardware. |
| **Backend Architecture** | Assumed a "centralized cloud backend or database." | Removed reference entirely. | **Decision 8:** Prevents unevidenced architectural claims. |

---

### Remaining Gaps & Information Needs

1. **System Architecture Specs:** The scenario does not state whether data synchronization occurs over continuous network connections (WebSockets/HTTP polling) or periodic batch updates, which affects offline capability design.
2. **SLA & Maintenance Terms:** The exact boundaries between the developer's post-release maintenance responsibilities and the food delivery company's internal IT operations remain unspecified.
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| "Test evidence—including unit tests, integration tests, and end-to-end validation—is essential before release." | Sommerville, I. (2016). *Software Engineering*, 10th ed., Chapter 2, §2.2.3 Software validation, pp. 58–59. | Sommerville describes software validation and staged component, system, and customer testing, but does not require this exact set of unit, integration, and end-to-end tests for every system. | qualify |
| "Post-release support is integral to software delivery." | Sommerville, I. (2016). *Software Engineering*, 10th ed., Chapter 1, §1.1 Professional software development, pp. 19–23. | Professional software is maintained and changed throughout its life, and software engineering covers production through operation and maintenance. | keep |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| "Test evidence—including unit tests, integration tests, and end-to-end validation—is essential before release." | The system should include validation and test evidence appropriate to its requirements, especially evidence for conflicting order-status updates. | Verification row 1 showed that Sommerville supports staged validation and testing, but not this exact universal set of test types for every system. |
| "Professional delivery covers ... data protection (e.g., protecting customer addresses and payment details)." | The final analysis discusses protection of customer personal data but removes the reference to payment details. | Payment processing was not part of the scenario, so keeping it would add an unsupported requirement. |
