import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UploaderComponent} from 'uploader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UploaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'uploader-demo';
}
