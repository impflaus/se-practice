#AI asked questions 


## Prompt #1
** Who will be using this student marks dashboard?**
**1. Teacher or instructor**
**2. School administrator**
**3. Student self-view**
**4. Personal/ solo use**



## Rewritten Prompt 
**A personal web utility for quickly processing a list of student marks. 
Enter marks and instantly see the computed average, highest score, lowest score, and pass rate — clean, fast, and built for 
solo use without any login or account needed.

Building with Next.js and TypeScript.**


## Test A
Input: 85, 23, 45, 90, 92
Rocket output: 
    MarksProcessor Results
    ─────────────────────
    Total Marks:   5
    Average:       67.00
    Highest:       92
    Lowest:        23
    Pass Threshold:50
    Pass Count:    3 (60.0%)
    Fail Count:    2
Match specification: Yes

## Test B
Input: 88, 47, -5, 101, abc, 73, 50, , 100
Rocket output: 
    MarksProcessor Results
    ─────────────────────
    Total Marks:   8
    Average:       71.60
    Highest:       100
    Lowest:        47
    Pass Threshold:50
    Pass Count:    4 (80.0%)
    Fail Count:    1
Match specification: Yes 

## Test C
Input: 10, 20, 30
Rocket Output: 
    MarksProcessor Results
    ─────────────────────
    Total Marks:   3
    Average:       20.00
    Highest:       30
    Lowest:        10
    Pass Threshold:50
    Pass Count:    0 (0.0%)
    Fail Count:    3
Match specification: Yes

## Test D
Input: abc, , xyz
Rocket output: No valid marks found
Match specification: Yes 


# Defect 

## Problem
The pass threshold was initially set to 40 and could be changed with a slider.
According to the specification, the pass threshold must always be fixed at 50.

## Follow-up Prompt
The pass threshold is incorrect. It was initially set to 40 and can be changed using a slider. 
According to the specification, the pass threshold must always be fixed at 50. 
Remove the threshold slider completely and make the passing condition static a mark passes if it is greater than or equal to 50.


# Preview link
https://www.rocket.new/6aa6bd838e16920014b6d680#preview
