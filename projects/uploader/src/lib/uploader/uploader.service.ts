import {inject, Injectable, signal} from '@angular/core';
import {ref, Storage, uploadBytesResumable} from '@angular/fire/storage';

export enum UploaderStatus {
  IDLE = 'idle',
  STARTING = 'starting',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  ERRORED = 'errored',
}

export type UploadItem = {
  id: string;
  file: File;
  status: UploaderStatus;
  progress: number; // percentage
  error?: string;
  hovered: boolean; // Optional property to track hover state
}

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  private readonly storage = inject(Storage);//later check if this is needed
  simulated = false;
  status = signal<UploaderStatus>(UploaderStatus.IDLE);
  items = signal<UploadItem[]>([]);
  constructor() {}

  /**
   * Adds an item to the uploader's list of items.
   * Only if the uploader is in the IDLE state.
   *
   * @param item - The upload item to be added
   * @returns void
   */
  addItem(item: UploadItem) {
    if (this.status() === UploaderStatus.IDLE) {
      this.items.update(currentItems => [...currentItems, item]);
    }
  }

  /**
   * Adds multiple items to the uploader's list of items.
   * Only if the uploader is in the IDLE state.
   *
   * @param items - An array of upload items to be added
   * @returns void
   */
  addMultipleItems(items: UploadItem[]) {
    if (this.status() === UploaderStatus.IDLE) {
      this.items.update(currentItems => [...currentItems, ...items]);
    }
  }

  remove(item: UploadItem) {
    this.items.update(currentItems => currentItems.filter(i => i.id !== item.id));
  }

  async startUpload() {
    if (this.status() === UploaderStatus.IDLE) {
      this.status.set(UploaderStatus.STARTING);
      for (let item of this.items()) {
        await this.uploadItem(item);
      }
      this.status.set(UploaderStatus.UPLOADING);
    }
  }

  async retryUpload(item: UploadItem) {
    this.__simulateUpload(item)
  }

  async uploadItem(item: UploadItem) {
    if (this.simulated) {
      const hasError = Math.random() < 0.2; // Simulate a 20% chance of error
      if (hasError) {
        item.status = UploaderStatus.ERRORED;
        item.error = 'Upload failed due to a simulated error.';
        if (this.items().every(i => i.status === UploaderStatus.COMPLETED || i.status === UploaderStatus.ERRORED)) {
          this.status.set(UploaderStatus.COMPLETED);
        }
        return;
      }
      this.__simulateUpload(item)
    } else {
      const storageRef = ref(this.storage, item.file.name);
      const uploadTask = uploadBytesResumable(storageRef, item.file);
      item.status = UploaderStatus.UPLOADING;
      uploadTask.on('state_changed', {
        'next': (snapshot) => {
          item.progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          if (this.items().every(i => i.status === UploaderStatus.COMPLETED || i.status === UploaderStatus.ERRORED)) {
            this.status.set(UploaderStatus.COMPLETED);
          }
          this.items.update(currentItems => [...currentItems]);
        },
        'error': (error) => {
          item.status = UploaderStatus.ERRORED;
          item.error = error.name;
        },
        'complete': () => {
          item.progress = 100;
          item.status = UploaderStatus.COMPLETED;
          if (this.items().every(i => i.status === UploaderStatus.COMPLETED || i.status === UploaderStatus.ERRORED)) {
            this.status.set(UploaderStatus.COMPLETED);
          }
          this.items.update(currentItems => [...currentItems]);
        },
      });
    }
  }

  __simulateUpload(item: UploadItem) {
    item.status = UploaderStatus.UPLOADING;
    const interval = setInterval(() => {
      if (item.progress < 100) {
        item.progress += Math.floor(Math.random() * 30); // Simulate progress
      } else {
        item.status = UploaderStatus.COMPLETED;
        clearInterval(interval);
        // Check if all items are completed
        if (this.items().every(i => i.status === UploaderStatus.COMPLETED || i.status === UploaderStatus.ERRORED)) {
          this.status.set(UploaderStatus.COMPLETED);
        }
      }
      this.items.update(currentItems => [...currentItems]); // Trigger change detection
    }, 1000);
  }
}
