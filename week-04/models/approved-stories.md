# User stories — Smart Campus study room booking

6 to 8 stories. Keep the shape exactly: ID, the As/I want/so that sentence, a priority, one
assumption. Roles are **Student** or **Administrator** only.

---

### US-01
**Story:** As a Student, I want to view room availability for a given day, so that I can find a free slot before booking.  
**Priority:** High  
**Assumption:** Availability shows which rooms are free for the selected day.

### US-02
**Story:** As a Student, I want to book a free room for a future time slot, so that I have a guaranteed place to study.  
**Priority:** High  
**Assumption:** A booking that starts exactly when another booking for the same room ends is not treated as an overlap.

### US-03
**Story:** As a Student, I want to book a room for up to two hours, so that I can reserve enough time for study while following the booking limit.  
**Priority:** High  
**Assumption:** A booking of exactly two hours is allowed.

### US-04
**Story:** As a Student, I want to cancel a booking I made, so that the room becomes free again for someone else if my plans change.  
**Priority:** Medium  
**Assumption:** A student can cancel only their own bookings.

### US-05
**Story:** As a Student, I want to receive a confirmation when my booking succeeds, so that I know the room is reserved for me.  
**Priority:** Medium  
**Assumption:** The system sends a confirmation after a successful booking.



### US-07
**Story:** As an Administrator, I want to block or unblock a room, so that I can control whether students are allowed to book it.  
**Priority:** High  
**Assumption:** A blocked room cannot be booked.

### US-08
**Story:** As an Administrator, I want to review room usage over a chosen period, so that I can see which rooms are over- or under-used.  
**Priority:** Medium  
**Assumption:** Room usage is based only on booking information.


