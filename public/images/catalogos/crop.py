import os
import cv2
import glob

base_dir = r"C:\Users\kabaru\Desktop\WEB LOS PETETES\lospetetes\public\images\catalogos"

crops = {
    # Belleza
    "Captura de pantalla 2026-03-24 143630.png": (0, 0.78, 0, 1),
    "Captura de pantalla 2026-03-24 143654.png": (0, 0.80, 0, 1),
    "Captura de pantalla 2026-03-24 143705.png": (0, 1, 0.32, 1), 
    "Captura de pantalla 2026-03-24 143714.png": (0, 0.85, 0, 1),
    "Captura de pantalla 2026-03-24 143721.png": (0, 0.82, 0, 1),
    "Captura de pantalla 2026-03-24 143730.png": (0, 0.85, 0, 1),
    "Captura de pantalla 2026-03-24 143931.png": (0, 1, 0, 0.65), # purple box right
    "Captura de pantalla 2026-03-24 143941.png": (0, 0.85, 0, 1),
    "Captura de pantalla 2026-03-24 143947.png": (0, 0.85, 0, 1),
    "Captura de pantalla 2026-03-24 144023.png": (0, 0.84, 0, 1),
    "Captura de pantalla 2026-03-24 144043.png": (0, 0.82, 0, 1),
    "Captura de pantalla 2026-03-24 144057.png": (0, 0.86, 0, 1),
    "Captura de pantalla 2026-03-24 144105.png": (0, 0.84, 0, 1),
    "Captura de pantalla 2026-03-24 144126.png": (0, 0.84, 0, 1),

    # Deportes
    "Captura de pantalla 2026-03-24 151548.png": (0, 1, 0, 0.65), # right text
    "Captura de pantalla 2026-03-24 151554.png": (0, 1, 0.32, 1), # left text
    "Captura de pantalla 2026-03-24 151615.png": (0, 0.88, 0, 1),
    "Captura de pantalla 2026-03-24 151626.png": (0, 1, 0, 0.65), # right text
    "Captura de pantalla 2026-03-24 152636.png": (0, 0.86, 0, 1),
    "Captura de pantalla 2026-03-24 152650.png": (0, 0.86, 0, 1),
    "Captura de pantalla 2026-03-24 152657.png": (0, 0.80, 0, 1),

    # Papeleria
    "Captura de pantalla 2026-03-24 145942.png": (0, 1, 0.32, 1), # left text
    "Captura de pantalla 2026-03-24 145950.png": (0, 1, 0.32, 1), # left text
    "Captura de pantalla 2026-03-24 145957.png": (0, 0.85, 0, 1),
    "Captura de pantalla 2026-03-24 150018.png": (0, 0.86, 0, 1),
    "Captura de pantalla 2026-03-24 150029.png": (0, 0.83, 0, 1),
    "Captura de pantalla 2026-03-24 150042.png": (0, 0.86, 0, 1),
    "Captura de pantalla 2026-03-24 151412.png": (0, 0.85, 0, 1),
    "Captura de pantalla 2026-03-24 151419.png": (0, 0.86, 0, 1),
}

files = glob.glob(os.path.join(base_dir, "**", "*.png"), recursive=True)

for path in files:
    filename = os.path.basename(path)
    if "cropped_" in filename:
        continue
    
    if filename in crops:
        img = cv2.imread(path)
        if img is None:
            continue
        
        h, w = img.shape[:2]
        t_pct, b_pct, l_pct, r_pct = crops[filename]
        
        y1, y2 = int(h * t_pct), int(h * b_pct)
        x1, x2 = int(w * l_pct), int(w * r_pct)
        
        cropped = img[y1:y2, x1:x2]
        
        # Save as completely new file with prefix "cropped_"
        new_path = os.path.join(os.path.dirname(path), f"cropped_{filename}")
        cv2.imwrite(new_path, cropped)
        print(f"Cropped {filename} -> {new_path}")
    else:
        # Default crop 20% bottom if not mapped precisely
        img = cv2.imread(path)
        if img is None: continue
        h, w = img.shape[:2]
        cv2.imwrite(os.path.join(os.path.dirname(path), f"cropped_{filename}"), img[:int(h*0.8), :])
        print(f"Auto-cropped bottom {filename}")

print("Done.")
