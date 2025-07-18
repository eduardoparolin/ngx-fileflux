import {Component, inject, input, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {UploaderController, UploaderService, UploaderStatus, UploadItem} from './uploader.service';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'lib-uploader',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  uploadService = inject(UploaderService)
  controller = input.required<UploaderController>();

  onMultipleFileUpload(e: { target: { files: { type: string; size: number }[] } } & any) {
    const files = e.target.files;
    const filesToUpload: UploadItem[] = [];
    Object.values(files).forEach((file) => {
      if (!(file instanceof File)) return;
      filesToUpload.push({
        id: crypto.randomUUID(),
        file: file,
        status: UploaderStatus.IDLE,
        progress: 0,
        hovered: false,
      })
    });
    this.uploadService.addMultipleItems(this.controller(), filesToUpload);
  }

  protected readonly UploaderStatus = UploaderStatus;
}
