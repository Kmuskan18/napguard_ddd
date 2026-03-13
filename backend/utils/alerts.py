# backend/utils/alerts.py

import winsound

def trigger_alert():
    """
    Trigger an alert when driver is drowsy.
    Uses Windows built-in sound (winsound).
    """
    # Frequency in Hz, Duration in ms
    frequency = 2500  # High-pitched beep
    duration = 1000   # 1 second
    winsound.Beep(frequency, duration)
