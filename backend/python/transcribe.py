import sys
from faster_whisper import WhisperModel

if len(sys.argv) < 2:
    print("No audio path provided")
    sys.exit(1)

audio_path = sys.argv[1]

# ⭐ Best balance for CPU laptops
model = WhisperModel("base", device="cpu", compute_type="int8")

segments, _ = model.transcribe(audio_path)

full_text = ""
for segment in segments:
    full_text += segment.text + " "

print(full_text.strip())
