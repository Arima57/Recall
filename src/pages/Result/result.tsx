import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonInput } from '@ionic/react';
import { useLocation } from 'react-router-dom';

const Result: React.FC = () => {
    const location = useLocation<{ result: any }>();
    const { result } = location.state || {};
    console.log(result);
  return (
    <div style={{padding: '3vw'}}>
    {result}
  </div>
  );
};

export default Result;
