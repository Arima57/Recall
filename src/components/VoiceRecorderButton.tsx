import { IonButton, IonIcon } from '@ionic/react';
import { micOutline, squareSharp } from 'ionicons/icons';
import { useCallback, useState } from 'react';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import transcript from '../backend/When_Did_I/voice';
const VoiceRecorderButton: React.FC<{ onRecordingComplete: (base64Audio: string) => void }> = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = useCallback(async () => {
      try {
        await VoiceRecorder.requestAudioRecordingPermission();
        await VoiceRecorder.startRecording();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting voice recording:', error);
      }
    }, []);
  
    const stopRecording = useCallback(async () => {
      try {
        const result = await VoiceRecorder.stopRecording();
        setIsRecording(false);
        if (result.value && result.value.recordDataBase64) {
          transcript(result.value.recordDataBase64).then(text => {
            onRecordingComplete(text);
          });
        }
      } catch (error) {
        console.error('Error stopping voice recording:', error);
      }
    }, [onRecordingComplete]);
  
    const handleTouchStart = useCallback(() => {
      startRecording();
    }, [startRecording]);
  
    const handleTouchEnd = useCallback(() => {
      if (isRecording) {
        stopRecording();
      }
    }, [isRecording, stopRecording]);
  
    return (
      <IonButton
        onTouchStart={handleTouchStart}
        onMouseDown={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        style={{ width: '48%'}}
        color={isRecording ? 'danger' : 'primary'}>
        <IonIcon icon={!isRecording ? micOutline : squareSharp} />
      </IonButton>
    );
  };
  
export { VoiceRecorderButton };