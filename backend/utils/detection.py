# backend/utils/detection.py

import cv2
import dlib
import time
import math
from scipy.spatial import distance

# -----------------------------
# Load dlib models
# -----------------------------
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("model/shape_predictor_68_face_landmarks.dat")

# -----------------------------
# Helper functions
# -----------------------------
def eye_aspect_ratio(eye):
    """Compute Eye Aspect Ratio (EAR)"""
    A = distance.euclidean((eye[1].x, eye[1].y), (eye[5].x, eye[5].y))
    B = distance.euclidean((eye[2].x, eye[2].y), (eye[4].x, eye[4].y))
    C = distance.euclidean((eye[0].x, eye[0].y), (eye[3].x, eye[3].y))
    ear = (A + B) / (2.0 * C)
    return ear

def mouth_aspect_ratio(mouth):
    """Compute Mouth Aspect Ratio (MAR)"""
    A = distance.euclidean((mouth[13].x, mouth[13].y), (mouth[19].x, mouth[19].y))
    B = distance.euclidean((mouth[14].x, mouth[14].y), (mouth[18].x, mouth[18].y))
    C = distance.euclidean((mouth[12].x, mouth[12].y), (mouth[16].x, mouth[16].y))
    mar = (A + B) / (2.0 * C)
    return mar

def get_head_pitch(landmarks):
    """Estimate head pitch using nose and chin points"""
    nose = landmarks.part(30)
    chin = landmarks.part(8)
    dy = chin.y - nose.y
    dx = chin.x - nose.x
    pitch = math.degrees(math.atan2(dy, dx))
    return pitch

# -----------------------------
# Main detection function
# -----------------------------
def detect_drowsiness(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)

    drowsy = False
    reasons = []
    ear = 0
    mar = 0
    pitch_deg = 0
    face_detected = False

    if len(faces) > 0:
        face_detected = True
        face = faces[0]
        landmarks = predictor(gray, face)

        # Eyes
        left_eye = [landmarks.part(i) for i in range(36, 42)]
        right_eye = [landmarks.part(i) for i in range(42, 48)]
        ear = (eye_aspect_ratio(left_eye) + eye_aspect_ratio(right_eye)) / 2.0

        # Mouth
        mouth = [landmarks.part(i) for i in range(48, 68)]
        mar = mouth_aspect_ratio(mouth)

        # Thresholds (Optimized)
        # Normal open eye is ~0.25-0.30. Closed is < 0.20.
        if ear < 0.21:
            reasons.append("eyes_closed")
        if mar > 0.8: # Lowered MAR for better yawn detection
            reasons.append("yawning")
        
        # Determine drowsy based on reasons
        if len(reasons) > 0:
            drowsy = True

    return {
        "drowsy": drowsy,
        "reasons": reasons,
        "ear": round(ear, 3),
        "mar": round(mar, 3),
        "face_detected": face_detected
    }
