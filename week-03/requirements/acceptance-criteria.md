# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer
is not.

- **Overlap:** a booking that ends exactly when another begins is allowed under R3 because back-to-back bookings do not share any actual time.
- **Duration:** a booking of exactly two hours is allowed under R2 because two hours is the maximum allowed duration.

---

## US-02 — Book a free room for a future time slot

### AC-01
- **Given** an unblocked room is free for a future two-hour time slot
- **When** a Student books that room for the slot
- **Then** the booking is created and the room is reserved for that time

### AC-02
- **Given** the current time is 13:00
- **When** a Student tries to book a room for 12:00–13:00 the same day
- **Then** the system rejects the booking because it does not start in the future

### AC-03
- **Given** a Student selects an available unblocked room and a future start time
- **When** they request a booking lasting two hours and one minute
- **Then** the system rejects the booking for exceeding the two-hour maximum

### AC-04
- **Given** an unblocked room already has a future booking from 10:00 to 12:00
- **When** a Student tries to book the same room from 11:00 to 13:00
- **Then** the system rejects the booking because the time slots overlap

### AC-05
- **Given** an unblocked room has a booking ending at 12:00
- **When** a Student books the same room starting at 12:00 for a future time slot
- **Then** the booking is accepted because back-to-back bookings are allowed

---

## US-04 — Cancel a booking I made

### AC-06
- **Given** a Student has their own future booking
- **When** they cancel it
- **Then** the booking is cancelled and the time slot becomes available again

### AC-07
- **Given** a booking belongs to another Student
- **When** the current Student attempts to cancel it
- **Then** the system rejects the cancellation request

### AC-08
- **Given** a Student tries to cancel a booking that does not exist or has already been cancelled
- **When** the cancellation is requested
- **Then** the system rejects the request because there is no active booking to cancel

### AC-09
- **Given** a Student cancels their future booking
- **When** the cancellation is processed
- **Then** the previously reserved time slot becomes available again for booking

---

## US-07 — Block or unblock a room

### AC-10
- **Given** a room is unblocked
- **When** an Administrator blocks it
- **Then** the room becomes blocked and students cannot make new bookings for it

### AC-11
- **Given** a room is blocked
- **When** an Administrator unblocks it
- **Then** the room becomes unblocked and can be booked if it is otherwise available

### AC-12
- **Given** a room is blocked and a Student selects an otherwise valid future time slot
- **When** the Student attempts to book the room
- **Then** the system rejects the booking because the room is blocked