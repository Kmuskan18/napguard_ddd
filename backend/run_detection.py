from utils.detection import detect_drowsiness
import time
import winsound

print("Starting webcam drowsiness detection...")

while True:
    data = detect_drowsiness(real_time=True)  # real_time=True to use webcam
    if data['face_detected']:
        print(data)
        if data['drowsy']:
            winsound.Beep(2500, 1000)
    time.sleep(0.1)  # small delay to reduce CPU usage
