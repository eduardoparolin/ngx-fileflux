import {Component, inject, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {UploaderService} from './uploader.service';
import {MiniUploaderService} from './mini-uploader.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTooltip} from '@angular/material/tooltip';
import {UploadStatusPipe} from './upload-status.pipe';

@Component({
  selector: 'mini-uploader',
  imports: [
    MatIcon,
    MatProgressSpinner,
    MatTooltip,
    UploadStatusPipe,
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
