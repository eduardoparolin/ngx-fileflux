import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MiniUploaderComponent, UploaderComponent, MiniUploaderService, UploaderService} from 'uploader';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UploaderComponent, MiniUploaderComponent, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  miniUploaderService = inject(MiniUploaderService);
  uploaderService = inject(UploaderService);
  title = 'uploader-demo';
}
