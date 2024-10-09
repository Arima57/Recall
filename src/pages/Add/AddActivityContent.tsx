import React, { useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonTextarea, IonToast, IonLoading } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { VoiceRecorderButton } from '../../components/VoiceRecorderButton';
import WhenDidI from '../../backend/When_Did_I/whendidi';

export const AddActivityContent: React.FC = () => {
  const [activityText, setActivityText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const manager = new WhenDidI();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activityText.trim()) return;

    setShowLoading(true);
    await manager.addActivity(activityText);
    setToastMessage(`New activity added: ${activityText}`);
    setShowToast(true);
    setShowLoading(false);
    setActivityText('');
  };

  const handleRecordingComplete = (text: string) => {
    setActivityText(text);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Add Activity</h2>
      
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <IonItem>
          <IonTextarea 
            autoGrow={true}
            value={activityText}
            onIonChange={e => setActivityText(e.detail.value!)}
          ></IonTextarea>
        </IonItem>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <IonButton expand="block" type="button" onClick={handleSubmit} style={{ width: '48%' }}>
            <IonIcon icon={addOutline} />
          </IonButton>
          <VoiceRecorderButton onRecordingComplete={handleRecordingComplete} />
        </div>
      </form>
      
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={1000}
      />
      <IonLoading
        isOpen={showLoading}
        message={'Please wait...'}
      />
    </div>
  );
};
