import math


def _is_number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def _in_range(value):
    return _is_number(value) and not math.isnan(value) and 0 <= value <= 100


def analyze_marks(marks, pass_mark=50):
    if not isinstance(marks, list) or len(marks) == 0:
        raise ValueError("marks must be a non-empty list")

    if not _in_range(pass_mark):
        raise ValueError("pass_mark must be a number from 0 to 100")

    for mark in marks:
        if not _in_range(mark):
            raise ValueError("each mark must be a number from 0 to 100")

    passed = sum(1 for mark in marks if mark >= pass_mark)

    return {
        "average": round(sum(marks) / len(marks), 2),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(passed / len(marks) * 100, 2),
    }


import unittest


class TestAnalyzeMarks(unittest.TestCase):
    def test_example(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_one_mark(self):
        self.assertEqual(
            analyze_marks([75]),
            {"average": 75.0, "highest": 75, "lowest": 75, "pass_rate": 100.0},
        )

    def test_one_mark_failing(self):
        self.assertEqual(
            analyze_marks([30]),
            {"average": 30.0, "highest": 30, "lowest": 30, "pass_rate": 0.0},
        )

    def test_decimal_marks(self):
        self.assertEqual(
            analyze_marks([49.5, 50.5, 75.25]),
            {"average": 58.42, "highest": 75.25, "lowest": 49.5, "pass_rate": 66.67},
        )

    def test_custom_pass_mark(self):
        result = analyze_marks([40, 60, 80], 70)
        self.assertEqual(result["pass_rate"], 33.33)

    def test_mark_equal_to_pass_mark_passes(self):
        result = analyze_marks([50, 49, 51], 50)
        self.assertEqual(result["pass_rate"], 66.67)

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "abc", 70])

    def test_mark_below_zero(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, -1, 70])

    def test_mark_above_100(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 101, 70])

    def test_boundary_marks_allowed(self):
        result = analyze_marks([0, 100])
        self.assertEqual(result["lowest"], 0)
        self.assertEqual(result["highest"], 100)

    def test_invalid_pass_mark(self):
        with self.assertRaises(ValueError):
            analyze_marks([50], -5)
        with self.assertRaises(ValueError):
            analyze_marks([50], 101)
        with self.assertRaises(ValueError):
            analyze_marks([50], "50")


if __name__ == "__main__":
    unittest.main()