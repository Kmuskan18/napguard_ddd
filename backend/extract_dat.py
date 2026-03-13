import bz2
import shutil

# Path to the downloaded .bz2 file
bz2_file = r"C:\Users\abhis\Downloads\shape_predictor_68_face_landmarks.dat.bz2"

# Path to save the extracted .dat file
dat_file = r"C:\Users\abhis\OneDrive\Desktop\DriverDrowsinessDetection_Full\backend\model\shape_predictor_68_face_landmarks.dat"

# Extract
with bz2.BZ2File(bz2_file, 'rb') as fr, open(dat_file, 'wb') as fw:
    shutil.copyfileobj(fr, fw)

print("Extraction complete ✅")
