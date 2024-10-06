import os
import pyaudio
import wave
from groq import Groq

# Initialize the Groq client
client = Groq(api_key="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")

# Set up audio recording parameters
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024
RECORD_SECONDS = 5
WAVE_OUTPUT_FILENAME = "recorded_audio.wav"

# Record audio
audio = pyaudio.PyAudio()

print("Recording...")

stream = audio.open(format=FORMAT, channels=CHANNELS,
                  rate=RATE, input=True,
                  frames_per_buffer=CHUNK)

frames = []

for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
  data = stream.read(CHUNK)
  frames.append(data)

print("Recording finished.")

stream.stop_stream()
stream.close()
audio.terminate()

# Save the recorded audio to a file
wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
wf.setnchannels(CHANNELS)
wf.setsampwidth(audio.get_sample_size(FORMAT))
wf.setframerate(RATE)
wf.writeframes(b''.join(frames))
wf.close()

# Transcribe the recorded audio
with open(WAVE_OUTPUT_FILENAME, "rb") as file:
  transcription = client.audio.transcriptions.create(
      file=(WAVE_OUTPUT_FILENAME, file.read()),
      model="distil-whisper-large-v3-en",
      response_format="json",
      language="en",
      temperature=0.0
  )

# Print the transcription text
print("Transcription:")
print(transcription.text)

# Clean up the audio file
os.remove(WAVE_OUTPUT_FILENAME)