import {Injectable, signal} from '@angular/core';

export enum UploaderStatus {
  IDLE = 'idle',
  STARTING = 'starting',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  ERRORED = 'errored',
}

export type UploadItem = {
  id: string;
  name: string;
  size: number;
  status: UploaderStatus;
  progress: number; // percentage
  error?: string;
  hovered: boolean; // Optional property to track hover state
}

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
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
      // Simulate starting the upload process
      for (let item of this.items()) {
        await this.uploadItem(item);
      }
      this.status.set(UploaderStatus.UPLOADING);
    }
    console.log(this.status(), this.items());
  }

  async retryUpload(item: UploadItem) {
    this.__simulateUpload(item)
  }

  async uploadItem(item: UploadItem) {
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
