import {Component, effect, HostListener, inject, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {UploaderService, UploaderStatus} from '../uploader/uploader.service';
import {MiniUploaderService} from './mini-uploader.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTooltip} from '@angular/material/tooltip';
import {UploadStatusPipe} from '../upload-status.pipe';
import {UploadQuantityStatusPipe} from '../upload-quantity-status.pipe';
import {Observable} from 'rxjs';

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
export class MiniUploaderComponent{
  uploadService = inject(UploaderService);
  miniUploadService = inject(MiniUploaderService);
  completedActionName = input<string>()

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(event: BeforeUnloadEvent) {
    event.stopPropagation();
    if (!(this.uploadService.status() === UploaderStatus.COMPLETED || this.uploadService.status() === UploaderStatus.IDLE)) {
      return window.confirm('Uploads are in progress. Are you sure you want to leave?');
    }
    return true;
  }

  constructor() {}

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
