import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonLabel, IonItem, IonInput, IonTextarea, IonButton, IonIcon, IonPopover} from '@ionic/react';
import { addOutline, micOutline} from 'ionicons/icons';
import { useParams } from 'react-router';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { useState, useRef, useCallback } from 'react';
import { AddActivityContent } from './Add/AddActivityContent';
import QueryActivityContent from './Query/QueryActivityContent';
import ActivitiesListContent from './List/ActivitiesListContent';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';

let globalRecording: string = '';

const Page: React.FC = () => {
  const { name } = useParams<{ name: string; }>();

  const renderPageContent = () => {
    switch (name) {
      case 'Add':
        return <AddActivityContent />;
      case 'Query':
        return <QueryActivityContent />;
      case 'List':
        return <ActivitiesListContent />;
      default:
        return <ExploreContainer name={name} />;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {renderPageContent()}
      </IonContent>
    </IonPage>
  );
};





export default Page;