import React from 'react';
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/react';
import { addOutline, micOutline } from 'ionicons/icons';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { useState, useRef, useCallback } from 'react';
import {VoiceRecorderButton} from '../../components/VoiceRecorderButton';

export const AddActivityContent: React.FC = () => {
const [activityText, setActivityText] = useState('');

const handleRecordingComplete = (base64Sound: string) => {
    const audio = new Audio(`data:audio/wav;base64,${base64Sound}`);
    audio.play().catch(error => {
    console.error('Error playing audio:', error);
    });
};

return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Add Activity</h2>
      
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <IonItem>
          <IonLabel position="floating"></IonLabel>
          <IonTextarea 
            autoGrow={true}
            value={activityText}
            onIonChange={e => setActivityText(e.detail.value!)}
          ></IonTextarea>
        </IonItem>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <IonButton expand="block" type="submit" style={{ width: '48%' }}>
            <IonIcon icon={addOutline} />
          </IonButton>
          <VoiceRecorderButton onRecordingComplete={handleRecordingComplete} />
        </div>
      </form>
      
    </div>
  );
};