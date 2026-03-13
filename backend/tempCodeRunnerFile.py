from flask import Flask, Response
from flask_cors import CORS
import cv2
import winsound
from utils.detection import detect_drowsiness

# -----------------------------
# Flask App Setup
# -----------------------------
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

cap = cv2.VideoCapture(0)

# -----------------------------
# Alert function
# -----------------------------
def trigger_alert():
    try:
        frequency = 2500  # Hz
        duration = 1000   # 1 second
        winsound.Beep(frequency, duration)
    except Exception as e:
        print("Beep error:", e)

# -----------------------------
# Frame Generator with Detection
# -----------------------------
def gen_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break

        # Drowsiness detection logic
        data = detect_drowsiness(frame)

        # Draw rectangle if face detected
        if data.get("face_detected", False):
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = cv2.CascadeClassifier(
                cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            ).detectMultiScale(gray, 1.3, 5)

            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Drowsiness alert
        if data.get("drowsy", False):
            cv2.putText(frame, "🚨 DROWSY ALERT!", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            trigger_alert()
        else:
            cv2.putText(frame, "✅ Awake", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Encode frame to JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        # Stream response
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# -----------------------------
# Routes
# -----------------------------
@app.route('/')
def index():
    return "✅ Driver Drowsiness Detection Backend Running <br> <a href='/video_feed'>Start Detection</a>"

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# -----------------------------
# Main
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
