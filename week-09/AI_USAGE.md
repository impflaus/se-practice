# AI Usage Disclosure — Week 09

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Gemini | Gemini 3.6 Flash | Part 2 — writing the calls/replies for R1, R2 and R3 in three fresh chats | `calls/r1.json`, `calls/r2.json`, `calls/r3.txt`; replies copied into `lab-report.md` |
| | | | |

**I wrote `tool/check_room.json` myself:** no
<!-- If an AI wrote or revised any of it, say which part, and how you checked it. -->
ChatGPT suggested the JSON Schema structure and constraints.

**I used an AI to explain a JSON Schema keyword or a check:** yes 
<!-- If "yes": which one, and for what. -->
ChatGPT explained why `required`, `additionalProperties`, integer ranges and nested booking item constraints were needed for S03-S12.

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes 

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
None. I reviewed the schema constraints, tool-call results, permission decisions and checker output before including them.

Signed: Dauren
Date: 2026-11-15
