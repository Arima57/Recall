import React, { useState, useEffect } from 'react';
import { IonContent, IonList, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonText, IonButton, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/react';
import { closeCircle, refresh } from 'ionicons/icons';
import WhenDidI from '../../backend/When_Did_I/whendidi';

const ActivitiesListContent: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const manager = new WhenDidI();
  const loadActivities = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const loadedActivities = manager.getActivities();
    setActivities(loadedActivities);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleDelete = (index: number) => {
    manager.delete(index);
    loadActivities();
  };

  const handleRefresh = (event: CustomEvent) => {
    loadActivities();
    event.detail.complete();
  };

  return (
    <IonContent className="ion-padding" fullscreen>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <IonList>
        {activities.map((activity, index) => (
          <IonCard key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <IonCardHeader>
                  <IonCardSubtitle>{formatTimestamp(activity.timestamp)}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>{activity.description}</IonText>
                </IonCardContent>
              </div>
              <IonButton 
                fill="clear" 
                onClick={() => handleDelete(index)}
              >
                <IonIcon icon={closeCircle} />
              </IonButton>
            </div>
          </IonCard>
        ))}
      </IonList>
    </IonContent>
  );
};

export default ActivitiesListContent;