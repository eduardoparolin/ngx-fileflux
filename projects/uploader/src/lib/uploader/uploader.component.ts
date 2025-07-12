import {Component, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {UploaderService, UploaderStatus, UploadItem} from './uploader.service';

@Component({
  selector: 'lib-uploader',
  imports: [
    MatIcon
  ],
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  uploadService = inject(UploaderService)

  onMultipleFileUpload(e: { target: { files: { type: string; size: number }[] } } & any) {
    const files = e.target.files;
    const filesToUpload: UploadItem[] = [];
    Object.values(files).forEach((file) => {
      // if (files.length >= 10) {
      //   return;
      // }
      if (!(file instanceof File)) return;
      if (
        file.type !== 'application/pdf' &&
        file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png' &&
        file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        return;
      }
      filesToUpload.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        status: UploaderStatus.IDLE,
        progress: 0,
        hovered: false
      })
      // if (file.size >= 52428800) { // 50 MB
      //   this.toastService.callErrorToast('Single file size limit exceeded (50 MB)');
      //   return;
      // }
      // const formattedFile = new File([file], file.name.split(' ').join('_'), { type: file.type });
      // files.push(formattedFile);
    });
    this.uploadService.addMultipleItems(filesToUpload);
  }
}
