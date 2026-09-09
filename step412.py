import cv2
import numpy as np

img = cv2.imread(r'C:\Users\HUAWEI\.gemini\antigravity\brain\c9954741-54a5-4085-929f-f5fca1c5d15a\.user_uploaded\media_1788838908405.png')
h, w, _ = img.shape
top_left = img[10, 10]
bottom_right = img[h-10, w-10]
center = img[h//2, w//2]

def to_hex(c):
    return '#%02x%02x%02x' % (c[2], c[1], c[0])

print('Top Left:', to_hex(top_left))
print('Center:', to_hex(center))
print('Bottom Right:', to_hex(bottom_right))
