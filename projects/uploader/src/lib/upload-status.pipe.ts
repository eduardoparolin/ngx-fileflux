import {Pipe, PipeTransform} from '@angular/core';
import {UploaderStatus} from './uploader/uploader.service';

@Pipe({
  name: 'uploadStatus',
})
export class UploadStatusPipe implements PipeTransform {
  transform(value: UploaderStatus): string {
    switch (value) {
      case UploaderStatus.IDLE:
        return 'Starting...';
      case UploaderStatus.UPLOADING:
        return 'Uploading...';
      case UploaderStatus.COMPLETED:
        return 'Completed';
      default:
        return 'Unknown Status';
    }
  }
}
