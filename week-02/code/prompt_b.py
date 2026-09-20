def analyze_marks(marks, pass_mark=50):
    """
    Analyze a list of marks.

    Args:
        marks: A non-empty list/tuple of numbers in the range 0-100.
        pass_mark: Minimum mark (inclusive) counted as a pass. Default 50.

    Returns:
        dict with keys: 'average', 'highest', 'lowest', 'pass_rate'
        (pass_rate is a percentage, 0-100).

    Raises:
        ValueError: if marks is empty, contains non-numeric or
        out-of-range values, or if pass_mark is invalid.
    """
    if marks is None or len(marks) == 0:
        raise ValueError("marks must not be empty")

    if isinstance(pass_mark, bool) or not isinstance(pass_mark, (int, float)):
        raise ValueError("pass_mark must be a number")
    if not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be between 0 and 100")

    for m in marks:
        # bool is a subclass of int, so reject it explicitly
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"non-numeric mark: {m!r}")
        if m != m:  # NaN check
            raise ValueError("marks must not contain NaN")
        if not 0 <= m <= 100:
            raise ValueError(f"mark out of range (0-100): {m}")

    total = sum(marks)
    count = len(marks)
    passed = sum(1 for m in marks if m >= pass_mark)

    return {
        "average": total / count,
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": passed / count * 100,
    }


if __name__ == "__main__":
    print(analyze_marks([45, 60, 75, 90, 30]))
    # {'average': 60.0, 'highest': 90, 'lowest': 30, 'pass_rate': 60.0}