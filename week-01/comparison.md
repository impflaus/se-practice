# Week 01 — Manual vs AI: Comparison

**Name: Dauren**
**Group: Monday, 16:00-19:00 **
**Date: 13.09.2026**

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python | Next.js + TypeScript |
| Time to first version that ran | 5:34 | 31min |
| Time to all 4 test cases passing | 16:09 | 31 min |
| Number of attempts / prompts needed | 5 | 3 |
| Lines of code you actually wrote | 38 | |
| Did it handle invalid marks (case B)? | yes | yes |
| Did it handle an empty list (case D)? | yes | yes |
| Did it use the ≥ 50 pass threshold? | yes | yes |
| Output format matches the spec? | yes | yes |
| Can you explain every line of it? | yes | |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | | | avg 67.00 · high 92 · low 23 · pass 60.0% | |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | | | avg 71.60 · high 100 · low 47 · pass 80.0% | |
| C | `10, 20, 30` | | | avg 20.00 · high 30 · low 10 · pass 0.0% | |
| D | `abc, , xyz` | | | clear message, no crash | |

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->

- web interface
- a score distribution chart
- median and standard deviation
- individual mark details
- pass/fail labels
- a copy results function
- Loading samples

## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->

- Rocket initially used a pass threshold of 40 and also allowed the threshold to be changed with a slider. The specification required the pass threshold to always be fixed at 50.

## 5. The defect I asked Rocket to fix

**Prompt I used: The pass threshold is incorrect. It was initially set to 40 and can be changed using a slider. According to the specification, the pass threshold must always be fixed at 50. Remove the threshold slider completely and make the passing condition static: a mark passes if it is greater than or equal to 50.**

**Result: fixed ** (fixed / partly fixed / broke something else)

**What this tells me: AI can create a working application quickly, but it still can make mistakes that do not match the specification. The result still needs to be checked by a human.**

---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
2. Where did the AI cost you time, or give you something that looked right but was not?
3. Which of these two artefacts would you be willing to put your name on, and why?
4. What must a human engineer still be responsible for after this experiment?

<!-- Write your reflection below this line -->

This task required me to create two identetical programs in two different ways. First of all, I wrote the program manually, which took more effort. Because, it needed to think more, about its logic, how to write the code, and then fixig it, if there was mistakes. 
However, this way was more understandable rather than using the AI methods. Otherwise, AI method using Rocket ai was more faster and easier to complete this task. I only gave it a simple prompt, and then it created a whole web application instead of a small program. 
It also added some extra features that I didnt asked, but it complemented the app well. This method shows me that I can easily create a simple web application in a few minutes just using a single prompts, however there was a some mistakes, for example, adding slider where it should not to be, thresold initially was 40, but according to specification there should was more than 50. Then, I fixed this problem, using another prompt.
The biggest difference is that manual coding gives me more control and understanding, while AI makes development much faster. I think AI is very useful for creating of a program, but I should not trust everything it generates. I still need to understand the requirements, test the program, find mistakes, so the AIs still should be controlled by humans. 


