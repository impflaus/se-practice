import math


def _is_number(value):
    """True for int/float, but not bool."""
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def analyze_marks(marks, pass_mark=50):
    """Return average, highest, lowest and pass_rate (%) for a list of marks.

    Raises ValueError for an empty input, non-numeric values,
    or values outside 0-100 (including NaN/inf and an invalid pass_mark).
    """
    marks = list(marks)

    if not marks:
        raise ValueError("marks must not be empty")

    if not _is_number(pass_mark) or math.isnan(pass_mark) or not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be a number between 0 and 100")

    for m in marks:
        if not _is_number(m):
            raise ValueError(f"non-numeric mark: {m!r}")
        if math.isnan(m) or not 0 <= m <= 100:
            raise ValueError(f"mark out of range (0-100): {m!r}")

    passed = sum(1 for m in marks if m >= pass_mark)

    return {
        "average": round(sum(marks) / len(marks), 2),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(passed / len(marks) * 100, 2),
    }


# ---------------------------- tests ----------------------------
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
        self.assertEqual(analyze_marks([20])["pass_rate"], 0.0)

    def test_decimals(self):
        result = analyze_marks([49.5, 50.5, 75.25])
        self.assertEqual(result["average"], 58.42)
        self.assertEqual(result["highest"], 75.25)
        self.assertEqual(result["lowest"], 49.5)
        self.assertEqual(result["pass_rate"], 66.67)

    def test_custom_pass_mark(self):
        result = analyze_marks([40, 60, 80], pass_mark=70)
        self.assertEqual(result["pass_rate"], 33.33)

    def test_pass_mark_boundary_counts_as_pass(self):
        self.assertEqual(analyze_marks([50, 49], 50)["pass_rate"], 50.0)

    def test_boundaries_0_and_100_accepted(self):
        result = analyze_marks([0, 100])
        self.assertEqual(result["lowest"], 0)
        self.assertEqual(result["highest"], 100)

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "abc", 70])

    def test_numeric_string_rejected(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "60"])

    def test_bool_rejected(self):
        with self.assertRaises(ValueError):
            analyze_marks([True, 50])

    def test_below_zero(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, -1])

    def test_above_100(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 100.1])

    def test_nan_rejected(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, float("nan")])

    def test_invalid_pass_mark(self):
        with self.assertRaises(ValueError):
            analyze_marks([50], pass_mark=150)


if __name__ == "__main__":
    unittest.main()