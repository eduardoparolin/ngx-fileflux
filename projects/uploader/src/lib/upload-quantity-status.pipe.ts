import {Pipe, PipeTransform} from '@angular/core';
import {UploaderStatus} from './uploader/uploader.service';

@Pipe({
  name: 'uploadQuantityStatus',
})
export class UploadQuantityStatusPipe implements PipeTransform {
  transform(value: UploaderStatus, quantity?: number): string {
    if (!quantity || quantity <= 0) {
      return 'Waiting for files.'
    }
    switch (value) {
      case UploaderStatus.IDLE:
        return 'Ready to Upload' + (quantity ? ` (${quantity})` : '') + '...';
      case UploaderStatus.STARTING:
        return 'Starting Upload' + (quantity ? ` (${quantity})` : '') + '...';
      case UploaderStatus.UPLOADING:
        return 'Uploading' + (quantity ? ` (${quantity})` : '') + '...';
      case UploaderStatus.COMPLETED:
        return 'Completed' + (quantity ? ` (${quantity})` : '') + ' files';
      default:
        return 'Unknown Status';
    }
  }
}
