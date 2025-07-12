import {Injectable, signal} from '@angular/core';

enum UploaderStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
}

export type UploadItem = {
  id: string;
  name: string;
  size: number;
  status: UploaderStatus;
  progress: number; // percentage
}

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  status = signal<UploaderStatus>(UploaderStatus.IDLE);
  items = signal<UploadItem[]>([]);
  constructor() {
    for (let i = 0; i < 10; i++) {
      this.addItem({
        id: `item-${i}`,
        name: `File ${i + 1}`,
        size: Math.floor(Math.random() * 1000) + 100, // Random size between 100 and 1100
        status: UploaderStatus.IDLE,
        progress: 0,
      });
    }
  }

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
}
