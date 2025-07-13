import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MiniUploaderComponent, UploaderComponent, MiniUploaderService, UploaderService} from 'uploader';
import {MatButton} from '@angular/material/button';
import {getDownloadURL, getStorage, ref} from '@angular/fire/storage';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UploaderComponent, MiniUploaderComponent, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  miniUploaderService = inject(MiniUploaderService);
  uploaderService = inject(UploaderService);
  title = 'uploader-demo';

  ngOnInit() {
    // Initialize the uploader service if needed
    const storage = getStorage();
    const r = ref(storage, '104-1233321aSas_ASasASa_sASasAS_.pdf');
    const d = getDownloadURL(r)
      .then(url => {
        console.log('Download URL:', url);
        // You can use the download URL as needed
      })
  }
}
