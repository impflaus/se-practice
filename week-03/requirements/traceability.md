# Traceability — use cases → stories → criteria

One row per use case. All six rows stay, even the ones with nothing behind them: an empty cell is a
finding you report, not a failure you hide. Use real IDs, comma-separated; write `none` where there
is nothing.

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | none | No |
| UC-02 Book room | US-02, US-03 | AC-01, AC-02, AC-03, AC-04, AC-05 | No |
| UC-03 Cancel booking | US-04 | AC-06, AC-07, AC-08, AC-09 | No |
| UC-04 Block or unblock room | US-07 | AC-10, AC-11, AC-12 | No |
| UC-05 Review usage | US-08 | none | No |
| UC-06 Send confirmation | US-05, US-06 | none | No |

**Stories that belong to no use case:** none

**What the gaps tell you:** There are no story-to-use-case gaps. Acceptance criteria exist only for the three selected stories, as required by the task.
