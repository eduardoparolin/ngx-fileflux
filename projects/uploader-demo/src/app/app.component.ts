import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  MiniUploaderComponent,
  UploaderComponent,
  MiniUploaderService,
  UploaderService,
  UploaderController
} from 'uploader';
import {MatButton} from '@angular/material/button';
import {getDownloadURL, Storage, ref} from '@angular/fire/storage';
import {LoginComponent} from './login/login.component';
import {Auth, authState} from '@angular/fire/auth';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UploaderComponent, MiniUploaderComponent, MatButton, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  miniUploaderService = inject(MiniUploaderService);
  uploaderService = inject(UploaderService);
  title = 'uploader-demo';

  private auth: Auth = inject(Auth);
  sAuthState = toSignal(authState(this.auth), {initialValue: null});

  private readonly storage: Storage = inject(Storage);

  controller = new UploaderController('didi');

  ngOnInit() {
    // Initialize the uploader service if needed
    const r = ref(this.storage, '104-1233321aSas_ASasASa_sASasAS_.pdf');
    const d = getDownloadURL(r)
      .then(url => {
        console.log('Download URL:', url);
        // You can use the download URL as needed
      })
  }
}
