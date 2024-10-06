import { IonButton, IonIcon, IonPopover, IonContent } from '@ionic/react';
import { micOutline } from 'ionicons/icons';
import { useCallback, useRef, useState } from 'react';
import { VoiceRecorder } from 'capacitor-voice-recorder';

let globalRecording: string = '';

const VoiceRecorderButton: React.FC<{ onRecordingComplete: (base64Sound: string) => void }> = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const popoverRef = useRef<HTMLIonPopoverElement>(null);
  
    const startRecording = useCallback(async () => {
      try {
        await VoiceRecorder.requestAudioRecordingPermission();
        await VoiceRecorder.startRecording();
        setIsRecording(true);
        setShowPopover(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }, []);
  
    const stopRecording = useCallback(async () => {
      try {
        const result = await VoiceRecorder.stopRecording();
        setIsRecording(false);
        setShowPopover(false);
        globalRecording = result.value.recordDataBase64;
        onRecordingComplete(globalRecording);
      } catch (error) {
        console.error('Error stopping recording:', error);
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
      <>
        <IonButton
          onTouchStart={handleTouchStart}
          onMouseDown={handleTouchStart}
          style={{ width: '48%' }}
        >
          <IonIcon icon={micOutline} />
        </IonButton>
        <IonPopover
          onTouchEnd={handleTouchEnd}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          ref={popoverRef}
          isOpen={showPopover}
          onDidDismiss={() => setShowPopover(false)}
        >
          <IonContent class="ion-padding">Recording...</IonContent>
        </IonPopover>
      </>
    );
  };
  export { VoiceRecorderButton };