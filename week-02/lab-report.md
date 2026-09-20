# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name: Kaztay Dauren**
**Group: Monday 16:00-19:00**
**Date: 19.09.2026**

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | Сlaude |
| Exact model name | Claude Sonnet 5 |
| Implementation language | Python |
| Date of the runs | 20.09.2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
"n/a — used Python"
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes 
- No follow-up questions were asked before Part 7: yes 
- Every output was saved **before** any editing: yes 

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. The AI assumed that student marks would be stored by subject and could be loaded from a CSV file. 
2. It also assumed that the pass mark is 40 and added its own grading system. 
3. It included extra features such as letter grades, class ranking, subject statistics, and grade distribution.

**Questions it should have asked and did not:**

1. It should have asked what function name and parameters were required, what the pass mark should be, what output should be returned, and how invalid input should be handled.
2. 

**Is the function named `analyze_marks` with the required signature?** yes / no — if no, what is it
called:  No. It did not implement the required analyze_marks(marks, pass_mark=50) function.


**First impression before testing** (one sentence — you will compare this with section 6 later):

The prompt was too vague, so the AI made many assumptions and produced a more complex program than the task required.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. It gave the exact function name and signature: analyze_marks(marks, pass_mark=50).
2. It clearly specified the required return values: average, highest, lowest, and pass_rate.
3. It specified input validation: marks must be from 0 to 100.
4. It required ValueError for empty input, non-numeric values, and out-of-range values.
5. It explicitly said not to use external libraries.

**What B still leaves open:**

1. The required rounding or precision for average and pass_rate is not specified.
2. The exact validation rules for pass_mark are not fully specified.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | Yes |
| decimals | Yes |
| custom pass_mark | Yes |
| empty list | Yes |
| text value | Yes |
| below 0 / above 100 | Yes |

**Do the AI's own tests pass against the AI's own code?** yes 

**Do they agree with the harness in section 6?** yes 

**Assumptions C stated explicitly before the code:
pass_rate is a percentage from 0 to 100 and is rounded to 2 decimal places.
A mark equal to pass_mark is considered passing (>=).
average is rounded to 2 decimal places.
highest and lowest are returned without additional rounding.
Boolean values are treated as non-numeric.
NaN and infinity are rejected.
pass_mark must be a numeric value from 0 to 100.
The function accepts any iterable of marks because the input is converted to a list.
**

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement exactly this function:
analyze_marks(marks, pass_mark=50)
The function must return a dictionary with exactly these four keys:
"average", "highest", "lowest", and "pass_rate".
Marks must be a list of numeric values from 0 to 100 inclusive. If the list is empty, contains a non-numeric value, or contains a value outside the range 0 to 100, raise ValueError.
A mark equal to pass_mark counts as passing, so use >= for the passing condition.
pass_mark must be a numeric value from 0 to 100 inclusive. Otherwise, raise ValueError.
The average must be rounded to 2 decimal places.
pass_rate must be calculated as the percentage of marks greater than or equal to pass_mark and rounded to 2 decimal places.
highest and lowest must be returned without unnecessary rounding.
Example:
analyze_marks([40, 60, 80], 50)
should return:
{
"average": 60.0,
"highest": 80,
"lowest": 40,
"pass_rate": 66.67
}
Use only the Python standard library. Do not add a CLI, file handling, classes, external libraries, or other features that were not requested.
Before the code, briefly state any assumptions that are still necessary.
Also provide tests covering:
one mark,
decimal marks,
a custom pass_mark,
an empty list,
a text value,
marks below 0 or above 100.
The function must use the exact name, signature, dictionary keys, validation rules, and rounding rules specified above.
```

**What I deliberately added that A, B and C did not have:**

1. An explicit rounding rule: average and pass_rate are rounded to 2 decimal places. B returned pass_rate=66.66666666666666 in case 1.
2. An explicit condition >= for a mark equal to pass_mark, plus «exactly these four keys» with their names in quotes.
3. Explicit validation of pass_mark (0–100), the requirement that marks is a list, and a ban on extras («no CLI, file handling, classes»).

**The ambiguity I found in the specification, and how I resolved it inside Prompt D: 
The specification gives pass_rate 66.67 for [40, 60, 80] but does not say the result must be rounded. Prompt B returned 66.66666666666666; the harness marked case 1 PASS only because of the 0.01 tolerance. A second ambiguity is whether a mark equal to pass_mark passes (case 3). In Prompt D I resolved both directly: "rounded to 2 decimal places" and "use >= for the passing condition".**

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | Error | Pass | Pass | Pass |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | Error | Pass | Pass | Pass |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | Error | Pass | Pass | Pass |
| 4 | `analyze_marks([], 50)` | raises ValueError | Error | Pass | Pass | Pass |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | Error | Pass | Pass | Pass |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | Error | Pass | Pass | Pass |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1-6 | file defines no callable named 'analyze_marks' |
| | | |
| | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
Write Python code to analyze student marks.
```

**Prompt B**

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**Prompt C**

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.

Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Prompt D**

```
You are a Python developer. Implement exactly this function:
analyze_marks(marks, pass_mark=50)
The function must return a dictionary with exactly these four keys:
"average", "highest", "lowest", and "pass_rate".
Marks must be a list of numeric values from 0 to 100 inclusive. If the list is empty, contains a non-numeric value, or contains a value outside the range 0 to 100, raise ValueError.
A mark equal to pass_mark counts as passing, so use >= for the passing condition.
pass_mark must be a numeric value from 0 to 100 inclusive. Otherwise, raise ValueError.
The average must be rounded to 2 decimal places.
pass_rate must be calculated as the percentage of marks greater than or equal to pass_mark and rounded to 2 decimal places.
highest and lowest must be returned without unnecessary rounding.
Example:
analyze_marks([40, 60, 80], 50)
should return:
{
"average": 60.0,
"highest": 80,
"lowest": 40,
"pass_rate": 66.67
}
Use only the Python standard library. Do not add a CLI, file handling, classes, external libraries, or other features that were not requested.
Before the code, briefly state any assumptions that are still necessary.
Also provide tests covering:
one mark,
decimal marks,
a custom pass_mark,
an empty list,
a text value,
marks below 0 or above 100.
The function must use the exact name, signature, dictionary keys, validation rules, and rounding rules specified above.
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | | | | |
| Requirement coverage | | | | |
| Verifiability (tests) | | | | |
| Assumptions stated | | | | |
| Noise (2 = none) | | | | |
| **Total / 10** | | | | |

**Prompt length, in words:** A __7__ · B __44__ · C __83__ · D __220__

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)



```

**Word count:**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.
2.
