import Groq from "groq-sdk";
import { Buffer } from 'buffer';
import { Capacitor } from "@capacitor/core";

const transcript = async (base64Sound: string): Promise<string> => {
  const groq = new Groq({
    apiKey: "", // Left empty
    dangerouslyAllowBrowser: true
  });
  const cleanedBase64Sound = base64Sound.replace(/\n/g, '');

  let wav: Blob;

  if (Capacitor.getPlatform() === 'web') {
    // For PC (web platform), directly convert base64 to WAV blob
    const byteCharacters = atob(cleanedBase64Sound);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    wav = new Blob([byteArray], { type: 'audio/wav' });
  } else {
    // For other platforms, use the existing conversion process
    const aacBlob = base64ToAACAndSave(cleanedBase64Sound);
    console.log("AAC Blob created:");
    wav = await convertAacToWav(aacBlob);
  }

  let transcription = "";

  // Create FormData and append necessary fields
  const formData = new FormData();
  formData.append('file', wav, 'audio.wav'); // Append Blob directly
  formData.append('model', 'distil-whisper-large-v3-en');
  formData.append('temperature', '0');
  formData.append('response_format', 'json');
  formData.append('language', 'en');

  console.log("FormData created:", formData);

  try {
    console.log("Sending request to API...");

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groq.apiKey}`,
        // No need to set Content-Type; it will be automatically set by FormData
      },
      body: formData
    });

    console.log("Received response from API:", response);

    if (!response.ok) {
      const errorText = await response.text(); // Get the response text for error messages
      console.error(`Error: HTTP ${response.status}`);
      console.error("Response text:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    transcription = result.text;
    console.log("Transcription received:", transcription);
  } catch (error) {
    console.error('Error during transcription process:', error);
  }

  return transcription;
}

function base64ToAACAndSave(base64Sound: string) : Blob {
  console.log("Received Base64 string to convert to .aac");

  // Step 1: Clean the Base64 string (remove prefix if exists)
  const cleanedBase64 = base64Sound.replace(/^data:audio\/aac;base64,/, "");
  console.log("Cleaned Base64 string:", cleanedBase64);

  // Step 2: Padding to ensure proper Base64 string length
  const paddedBase64 = cleanedBase64.padEnd(cleanedBase64.length + (4 - (cleanedBase64.length % 4)) % 4, "=");
  console.log("Padded Base64 string:", paddedBase64);

  // Step 3: Decode the Base64 string to a binary array
  const binaryString = Buffer.from(paddedBase64, 'base64').toString('binary');
  console.log("Binary string after decoding Base64:", binaryString);

  // Step 4: Convert binary string to Uint8Array
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  console.log("Converted byte array:", byteArray);

  // Step 5: Create a Blob representing the AAC file
  const blob = new Blob([byteArray], { type: "audio/aac" });
  console.log("Created .aac Blob");

  // Step 6: Simulate saving by creating an Object URL
  const aacURL = URL.createObjectURL(blob);
  console.log("Created AAC Object URL:", aacURL);

  // Return the Blob for further operations
  return blob;
}

function convertAacToWav(aacBlob: Blob): Promise<Blob> {
    console.log("Starting AAC to WAV conversion...");

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
    
      reader.onload = function () {
        const aacArrayBuffer = reader.result as ArrayBuffer;
        console.log("Loaded AAC file into ArrayBuffer:", aacArrayBuffer);

        // Step 2: Extract AAC data and manually create a WAV structure
        const wavBuffer = convertArrayBufferToWav(aacArrayBuffer);
        console.log("Converted ArrayBuffer to WAV format");

        // Step 3: Create a WAV Blob
        const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
        console.log("Created WAV Blob:", wavBlob);
        resolve(wavBlob);
      };

      reader.onerror = function (error) {
        reject(error);
      };

      reader.readAsArrayBuffer(aacBlob);
    });
}

function convertArrayBufferToWav(aacArrayBuffer: ArrayBuffer): ArrayBuffer {
  console.log("Converting AAC ArrayBuffer to WAV...");
  
  // 1. RIFF header
  // 2. fmt  sub-chunk 
  // 3. data sub-chunk 
  
  const wavHeaderSize = 44; 
  const aacData = new Uint8Array(aacArrayBuffer);
  const wavSize = wavHeaderSize + aacData.length;

  const wavBuffer = new ArrayBuffer(wavSize);
  const view = new DataView(wavBuffer);

  // RIFF chunk descriptor
  view.setUint32(0, 0x46464952, true); // "RIFF"
  view.setUint32(4, wavSize - 8, true); // Chunk size
  view.setUint32(8, 0x45564157, true); // "WAVE"

  // fmt sub-chunk
  view.setUint32(12, 0x20746d66, true); // "fmt "
  view.setUint32(16, 16, true); // Subchunk size (PCM = 16)
  view.setUint16(20, 1, true); // Audio format (PCM = 1)
  view.setUint16(22, 1, true); // Number of channels (Mono = 1)
  view.setUint32(24, 44100, true); // Sample rate (44.1kHz)
  view.setUint32(28, 44100 * 1 * 16 / 8, true); // Byte rate
  view.setUint16(32, 1 * 16 / 8, true); // Block align
  view.setUint16(34, 16, true); // Bits per sample (16)

  // data sub-chunk
  view.setUint32(36, 0x61746164, true); // "data"
  view.setUint32(40, aacData.length, true); // Data size
  
  // Write the AAC data (which we're pretending is PCM for simplicity)
  for (let i = 0; i < aacData.length; i++) {
    view.setUint8(44 + i, aacData[i]);
  }

  console.log("WAV header and data created successfully");

  return wavBuffer;
}

export default transcript;
