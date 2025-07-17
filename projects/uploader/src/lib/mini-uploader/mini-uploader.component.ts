import {Component, HostListener, inject, input, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {UploaderController, UploaderService, UploaderStatus} from '../uploader/uploader.service';
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
  controller = input.required<UploaderController>();

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(event: BeforeUnloadEvent) {
    event.stopPropagation();
    if (!(this.controller().status() === UploaderStatus.COMPLETED || this.controller().status() === UploaderStatus.IDLE)) {
      return window.confirm('Uploads are in progress. Are you sure you want to leave?');
    }
    return true;
  }

  constructor() {}

  getActionText() {
    if (this.controller().items().length === 0) {
      return null;
    }
    switch (this.controller().status()) {
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
