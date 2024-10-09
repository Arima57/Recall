import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation, useHistory } from 'react-router-dom';
import { heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, cardSharp, addSharp, searchSharp} from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Add activity',
    url: '/crack/Add',
    iosIcon: addSharp,
    mdIcon: addSharp
  },
  {
    title: 'Query Activity',
    url: '/crack/Query',
    iosIcon: paperPlaneOutline,
    mdIcon: searchSharp
  },
  {
    title: 'Activities List',
    url: '/crack/List',
    iosIcon: heartOutline,
    mdIcon: cardSharp
  }
];

const Menu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const handleClick = (url: string) => {
    history.push(url);
    window.location.reload();
  };

  return (
    <IonMenu contentId="main" type="overlay" color='dark'>
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Recall</IonListHeader>
          <IonNote>When did I do it?</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem 
                  className={location.pathname === appPage.url ? 'selected' : ''} 
                  onClick={() => handleClick(appPage.url)} 
                  lines="none" 
                  detail={false}
                >
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;