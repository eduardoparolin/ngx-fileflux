import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {getAuth, provideAuth} from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({
      projectId: "aoa-labs",
      appId: "1:1078604004638:web:5b8e5c16f112f964de9d0f",
      storageBucket: "aoa-labs.appspot.com",
      apiKey: "AIzaSyCD0I-7lJbX2JkwedVuz87Fil4BlmBcg7s",
      authDomain: "aoa-labs.firebaseapp.com",
      messagingSenderId: "1078604004638",
      measurementId: "G-7Z89FPH0KC"
    })),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth())
  ]
};
