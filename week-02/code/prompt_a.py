"""
Student Marks Analyzer
----------------------
Analyzes student marks from a CSV file (or built-in sample data).

CSV format (header required):
    name,math,physics,chemistry,english
    Alice,88,92,79,85

Usage:
    python student_marks_analysis.py                # uses sample data
    python student_marks_analysis.py marks.csv      # uses your CSV
"""

import csv
import statistics
import sys
from collections import Counter

PASS_MARK = 40

SAMPLE_DATA = {
    "Alice":   {"Math": 88, "Physics": 92, "Chemistry": 79, "English": 85},
    "Bob":     {"Math": 65, "Physics": 58, "Chemistry": 72, "English": 60},
    "Charlie": {"Math": 34, "Physics": 45, "Chemistry": 38, "English": 55},
    "Diana":   {"Math": 95, "Physics": 89, "Chemistry": 94, "English": 91},
    "Ethan":   {"Math": 52, "Physics": 47, "Chemistry": 61, "English": 70},
    "Fatima":  {"Math": 78, "Physics": 81, "Chemistry": 69, "English": 88},
}


def load_csv(path):
    """Load marks from a CSV file into {student: {subject: mark}}."""
    data = {}
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        subjects = [c for c in reader.fieldnames if c.lower() != "name"]
        for row in reader:
            marks = {}
            for s in subjects:
                try:
                    marks[s] = float(row[s])
                except (ValueError, TypeError):
                    print(f"Warning: invalid mark for {row['name']} in {s}; skipped.")
            data[row["name"]] = marks
    return data


def grade(avg):
    if avg >= 90: return "A+"
    if avg >= 80: return "A"
    if avg >= 70: return "B"
    if avg >= 60: return "C"
    if avg >= 50: return "D"
    if avg >= PASS_MARK: return "E"
    return "F"


def student_summary(data):
    """Per-student total, average, grade, and pass/fail status."""
    summary = {}
    for name, marks in data.items():
        values = list(marks.values())
        avg = statistics.mean(values)
        summary[name] = {
            "total": sum(values),
            "average": avg,
            "grade": grade(avg),
            "passed": all(m >= PASS_MARK for m in values),
            "failed_subjects": [s for s, m in marks.items() if m < PASS_MARK],
        }
    return summary


def subject_summary(data):
    """Per-subject statistics across all students."""
    subjects = sorted({s for marks in data.values() for s in marks})
    stats = {}
    for subj in subjects:
        scores = [m[subj] for m in data.values() if subj in m]
        stats[subj] = {
            "mean": statistics.mean(scores),
            "median": statistics.median(scores),
            "stdev": statistics.stdev(scores) if len(scores) > 1 else 0.0,
            "highest": max(scores),
            "lowest": min(scores),
            "pass_rate": 100 * sum(s >= PASS_MARK for s in scores) / len(scores),
        }
    return stats


def print_report(data):
    students = student_summary(data)
    subjects = subject_summary(data)

    print("=" * 62)
    print("STUDENT RESULTS")
    print("=" * 62)
    print(f"{'Rank':<5}{'Name':<12}{'Total':>8}{'Avg':>8}{'Grade':>7}  Status")
    print("-" * 62)
    ranked = sorted(students.items(), key=lambda kv: kv[1]["average"], reverse=True)
    for rank, (name, s) in enumerate(ranked, 1):
        status = "PASS" if s["passed"] else "FAIL (" + ", ".join(s["failed_subjects"]) + ")"
        print(f"{rank:<5}{name:<12}{s['total']:>8.0f}{s['average']:>8.1f}{s['grade']:>7}  {status}")

    print("\n" + "=" * 62)
    print("SUBJECT STATISTICS")
    print("=" * 62)
    print(f"{'Subject':<12}{'Mean':>7}{'Median':>8}{'StDev':>8}{'High':>6}{'Low':>6}{'Pass%':>8}")
    print("-" * 62)
    for subj, st in subjects.items():
        print(f"{subj:<12}{st['mean']:>7.1f}{st['median']:>8.1f}{st['stdev']:>8.1f}"
              f"{st['highest']:>6.0f}{st['lowest']:>6.0f}{st['pass_rate']:>8.0f}")

    print("\n" + "=" * 62)
    print("HIGHLIGHTS")
    print("=" * 62)
    top_name, top = ranked[0]
    print(f"Top performer     : {top_name} (avg {top['average']:.1f})")
    hardest = min(subjects.items(), key=lambda kv: kv[1]["mean"])
    easiest = max(subjects.items(), key=lambda kv: kv[1]["mean"])
    print(f"Hardest subject   : {hardest[0]} (mean {hardest[1]['mean']:.1f})")
    print(f"Strongest subject : {easiest[0]} (mean {easiest[1]['mean']:.1f})")
    passed = sum(s["passed"] for s in students.values())
    print(f"Overall pass rate : {100 * passed / len(students):.0f}% ({passed}/{len(students)})")

    print("\nGrade distribution:")
    dist = Counter(s["grade"] for s in students.values())
    for g in ["A+", "A", "B", "C", "D", "E", "F"]:
        if dist[g]:
            print(f"  {g:<3} {'#' * dist[g]} ({dist[g]})")


if __name__ == "__main__":
    marks_data = load_csv(sys.argv[1]) if len(sys.argv) > 1 else SAMPLE_DATA
    print_report(marks_data)