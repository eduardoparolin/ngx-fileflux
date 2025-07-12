import {Component, inject, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {UploaderService} from './uploader.service';
import {MiniUploaderService} from './mini-uploader.service';

@Component({
  selector: 'mini-uploader',
  imports: [
    MatIcon,
  ],
  templateUrl: './mini-uploader.component.html',
  styleUrls: ['./mini-uploader.component.scss'],
  host: {
    '[class.expanded]': 'miniUploadService.expanded()',
  }
})
export class MiniUploaderComponent {
  uploadService = inject(UploaderService);
  miniUploadService = inject(MiniUploaderService);

  constructor() {
  }
}
