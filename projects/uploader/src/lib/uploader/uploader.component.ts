import {Component, HostListener, inject, input, OnInit, output} from '@angular/core';
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
  enablePaste = input<boolean>(false);
  maxUploadSizeError = output<string>()

  @HostListener('window:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.enablePaste()) {
      return;
    }
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const filesToUpload: UploadItem[] = [];
      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const file = item.getAsFile();
        if (!(file instanceof File)) continue;
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!(this.controller().acceptItems as string[]).includes(`.${extension}`)) {
          console.warn(`File type ${extension} is not accepted.`);
          continue;
        }
        filesToUpload.push({
          id: crypto.randomUUID(),
          file: file,
          status: UploaderStatus.IDLE,
          progress: 0,
          hovered: false,
        })
      }
      try {
        this.uploadService.addMultipleItems(this.controller(), filesToUpload);
      } catch (error: any) {
        if (error.message.includes('Cannot add more than')) {
          this.maxUploadSizeError.emit(error.message);
        } else {
          console.error('Error adding files:', error);
        }
      }
    }
  }

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
    try {
      this.uploadService.addMultipleItems(this.controller(), filesToUpload);
    } catch (error: any) {
      if (error.message.includes('Cannot add more than')) {
        this.maxUploadSizeError.emit(error.message);
      } else {
        console.error('Error adding files:', error);
      }
    }
  }

  protected readonly UploaderStatus = UploaderStatus;
}
