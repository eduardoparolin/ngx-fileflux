import {Component, inject, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {UploaderService, UploaderStatus} from '../uploader/uploader.service';
import {MiniUploaderService} from './mini-uploader.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTooltip} from '@angular/material/tooltip';
import {UploadStatusPipe} from '../upload-status.pipe';
import {UploadQuantityStatusPipe} from '../upload-quantity-status.pipe';

@Component({
  selector: 'mini-uploader',
  imports: [
    MatIcon,
    MatProgressSpinner,
    MatTooltip,
    UploadStatusPipe,
    UploadQuantityStatusPipe,
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
  completedActionName = input<string>()

  constructor() {
  }

  getActionText() {
    if (this.uploadService.items().length === 0) {
      return null;
    }
    switch (this.uploadService.status()) {
      case UploaderStatus.IDLE:
        return 'Start';
      case UploaderStatus.STARTING:
        return 'Cancel';
      case UploaderStatus.UPLOADING:
        return 'Cancel';
      case UploaderStatus.COMPLETED:
        return this.completedActionName();
      default:
        return null;
    }
  }

  protected readonly UploaderStatus = UploaderStatus;
}
