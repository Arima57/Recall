import React, { useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonTextarea, IonLoading } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { VoiceRecorderButton } from '../../components/VoiceRecorderButton';
import WhenDidI from '../../backend/When_Did_I/whendidi';
import { useHistory } from 'react-router-dom';

export const QueryActivityContent: React.FC = () => {
  const [activityText, setActivityText] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const history = useHistory();

  const manager = new WhenDidI();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activityText.trim()) return;

    setShowLoading(true);
    try {
      const result = await manager.queryActivities(activityText);
      setShowLoading(false);
      history.push('/crack/Result', { result });
    } catch (error) {
      console.error('Error querying activities:', error);
      setShowLoading(false);
    }
    setActivityText('');
  };

  const handleRecordingComplete = (text: string) => {
    setActivityText(prevText => prevText + ' ' + text);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Ask about Activity</h2>
      
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
            <IonIcon icon={searchOutline} />
          </IonButton>
          <VoiceRecorderButton onRecordingComplete={handleRecordingComplete} />
        </div>
      </form>
      
      <IonLoading
        isOpen={showLoading}
        message={'Loading...'}
      />
    </div>
  );
};
