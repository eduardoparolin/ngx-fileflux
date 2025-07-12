import {Pipe, PipeTransform} from '@angular/core';
import {UploaderStatus, UploadItem} from './uploader/uploader.service';

@Pipe({
  name: 'uploadQuantityStatus',
})
export class UploadQuantityStatusPipe implements PipeTransform {
  transform(value: UploaderStatus, items?: UploadItem[]): string {
    if (!items || items.length === 0) {
      return 'Waiting for files.'
    }
    const quantityIdle = items.filter(item => item.status === UploaderStatus.IDLE).length ?? 0;
    const quantityInProgress = items.filter(item => item.status === UploaderStatus.UPLOADING).length ?? 0;
    const quantityCompleted = items.filter(item => item.status === UploaderStatus.COMPLETED).length ?? 0;
    const erroredQuantity = items.filter(item => item.status === UploaderStatus.ERRORED).length ?? 0;
    if (quantityIdle <= 0 && quantityInProgress <= 0 && quantityCompleted <= 0 && erroredQuantity <= 0) {
      return 'Waiting for files.'
    }
    switch (value) {
      case UploaderStatus.IDLE:
        return `Ready to Upload (${quantityIdle})...`;
      case UploaderStatus.STARTING:
        return `Starting Upload (${quantityInProgress})...`;
      case UploaderStatus.UPLOADING:
        let erroredDuringUpload = erroredQuantity > 0 ? `- Errored (${erroredQuantity})` : '';
        return `Uploading (${quantityInProgress}) ${erroredDuringUpload}`;
      case UploaderStatus.COMPLETED:
        let errored = erroredQuantity > 0 ? `- Errored (${erroredQuantity})` : '';
        return `Completed (${quantityCompleted}) ${errored}` ;
      default:
        return 'Unknown Status';
    }
  }
}
