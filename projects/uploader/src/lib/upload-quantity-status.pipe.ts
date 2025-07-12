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
    const quantityIdle = items.filter(item => item.status === UploaderStatus.IDLE).length;
    const quantityInProgress = items.filter(item => item.status === UploaderStatus.UPLOADING).length;
    const quantityCompleted = items.filter(item => item.status === UploaderStatus.COMPLETED).length;
    const erroredQuantity = items.filter(item => item.status === UploaderStatus.ERRORED).length;
    if (quantityIdle <= 0 && quantityInProgress <= 0 && quantityCompleted <= 0 && erroredQuantity <= 0) {
      return 'Waiting for files.'
    }
    switch (value) {
      case UploaderStatus.IDLE:
        return 'Ready to Upload' + (quantityIdle ? ` (${quantityIdle})` : '') + '...';
      case UploaderStatus.STARTING:
        return 'Starting Upload' + (quantityInProgress ? ` (${quantityInProgress})` : '') + '...';
      case UploaderStatus.UPLOADING:
        return 'Uploading' + (quantityInProgress ? ` (${quantityInProgress})` : '') + '...';
      case UploaderStatus.COMPLETED:
        let errored = 'Errored' + (erroredQuantity ? `(${erroredQuantity})` : '') + ' ';
        return 'Completed' + (quantityCompleted ? `(${quantityCompleted})` : '') + ` ${erroredQuantity ? errored : ''}` ;
      default:
        return 'Unknown Status';
    }
  }
}
