def can_book(start, end, now, blocked, existing):
    if blocked:
        return False

    if not (0 <= start < end <= 1440 and start > now):
        return False

    if end - start > 120:
        return False

    for e_start, e_end in existing:
        if start < e_end and end > e_start:
            return False

    return True
