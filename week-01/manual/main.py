marks = input("Enter mark: ")

n = marks.split(",")
valid_marks = []

for t in n:
    t = t.strip()
    
    try:
        mark = float(t)
        
        if 0 <= mark <= 100:
            valid_marks.append(mark)
        
    except ValueError:
        pass
    
if len(valid_marks) == 0:
    print("")
else: 
    average = sum(valid_marks) / len(valid_marks)
    highest = max(valid_marks)
    lowest = min(valid_marks)
    
    passed = 0
    
    for mark in valid_marks: 
        if mark >= 50:
            passed += 1
    
    pass_rate = passed / len(valid_marks) * 100
    
    
    print("Number of valid marks:", len(valid_marks))
    print(f"Average: {average:.2f}")
    print(f"Highest: {highest:g}")
    print(f"Lowest: {lowest:g}")
    print(f"Pass rate: {pass_rate:.1f}%")