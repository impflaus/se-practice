# booking.py

def can_book(start, end, now, blocked, existing):
    """
    Checks if a room can be booked based on timing, availability, and existing bookings.
    
    Parameters:
    - start (int): Start time in minutes after midnight.
    - end (int): End time in minutes after midnight.
    - now (int): Current time in minutes after midnight (0-1439).
    - blocked (bool): True if the room is blocked/disabled, False otherwise.
    - existing (iterable): Sequence of (start, end) tuples of active bookings.
    
    Returns:
    - bool: True if all criteria AC1-AC4 hold, False otherwise.
    """
    # AC3: Check if the room is blocked.
    if blocked:
        return False

    # AC1: Validate time boundaries and ensure the booking starts in the future.
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: Check that the booking duration is at most 120 minutes.
    if end - start > 120:
        return False

    # AC4: Check for overlaps with existing bookings.
    # Half-open interval overlap rule: [start, end) overlaps with [e_start, e_end)
    # if start < e_end and end > e_start. Touching endpoints do not overlap.
    for e_start, e_end in existing:
        if start < e_end and end > e_start:
            return False

    # AC5: Return True when all conditions AC1-AC4 pass.
    return True