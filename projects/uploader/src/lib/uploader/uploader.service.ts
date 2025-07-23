import {inject, Injectable, signal, WritableSignal} from '@angular/core';
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
  prefix?: string; // Optional property to track prefix
  name?: string; // Optional substitute for file name
}

type AcceptInputTypes = '.jpg' | '.jpeg' | '.png' | '.pdf' | '.docx' | '.xlsx' | '.mp4' | '.avi' | '.mkv' | '.mov' | '.webm' | '.gif' | '.txt' | '.zip' | '.mp3' | '.m4a' | '.flac' | '.wav' | '.au' | '.amr' | '.ogg';

export class UploaderController {
  uploadId: string;
  acceptItems: AcceptInputTypes[] = [];
  uploadPrefixPredicate?: (file: File) => string;
  nameReplacementsPredicate?: (file: File) => string;
  items = signal<UploadItem[]>([]);
  get status() {
    if (this.items().length === 0) {
      return signal<UploaderStatus>(UploaderStatus.IDLE);
    }
    if (this.items().some((i) => i.status === UploaderStatus.IDLE)) {
      return signal<UploaderStatus>(UploaderStatus.IDLE);
    } else if (this.items().some((i) => i.status === UploaderStatus.UPLOADING)) {
      return signal<UploaderStatus>(UploaderStatus.UPLOADING);
    } else if (this.items().every((i) => i.status === UploaderStatus.COMPLETED)) {
      return signal<UploaderStatus>(UploaderStatus.COMPLETED);
    } else {
      return signal<UploaderStatus>(UploaderStatus.IDLE);
    }
  }

  constructor(uploadId: string, accept: AcceptInputTypes[], uploadPrefixPredicate?: (file: File) => string, nameReplacementsPredicate?: (file: File) => string) {
    this.uploadId = uploadId;
    this.acceptItems = accept;
    this.uploadPrefixPredicate = uploadPrefixPredicate;
    this.nameReplacementsPredicate = nameReplacementsPredicate;
  }

  setNameReplacementsPredicate(predicate: (file: File) => string): UploaderController {
    this.nameReplacementsPredicate = predicate;
    this.items.update(currentItems => [...currentItems.map(item => ({
      ...item,
      name: predicate(item.file)
    }))]);
    return this;
  }

  accept(accept: AcceptInputTypes): UploaderController {
    this.acceptItems.push(accept);
    return this;
  }

  addMultiple(items: UploadItem[]): UploaderController {
    items = items.map((item) => {
      return {
        ...item,
        prefix: this.uploadPrefixPredicate ? this.uploadPrefixPredicate!(item.file) : '',
        name: this.nameReplacementsPredicate ? this.nameReplacementsPredicate!(item.file) : item.file.name,
      }
    });
    this.items.update(currentItems => [...currentItems, ...items]);
    return this;
  }
}

@Injectable()
export class UploaderService {
  private readonly storage = inject(Storage);//later check if this is needed
  simulated = false;
  constructor() {}
  /**
   * Adds multiple items to the uploader's list of items.
   * Only if the uploader is in the IDLE state.
   *
   * @param items - An array of upload items to be added
   * @returns void
   */
  addMultipleItems(controller: UploaderController, items: UploadItem[]) {
    console.log(controller.items(), controller.status());
    if (controller.status() === UploaderStatus.IDLE) {
      controller.addMultiple(items);
    }
  }

  remove(controller: UploaderController, item: UploadItem) {
    controller.items.update(currentItems => currentItems.filter(i => i.id !== item.id));
  }

  async startUpload(controller: UploaderController) {
    if (controller.status() === UploaderStatus.IDLE) {
      controller.status.set(UploaderStatus.STARTING);
      for (let item of controller.items()) {
        await this.uploadItem(item, controller);
      }
      controller.status.set(UploaderStatus.UPLOADING);
    }
  }

  async retryUpload(item: UploadItem, controller: UploaderController) {
    this.__simulateUpload(item, controller)
  }

  async uploadItem(item: UploadItem, controller: UploaderController) {
    if (this.simulated) {
      const hasError = Math.random() < 0.2; // Simulate a 20% chance of error
      if (hasError) {
        item.status = UploaderStatus.ERRORED;
        item.error = 'Upload failed due to a simulated error.';
        if (controller.items().every(i => i.status === UploaderStatus.COMPLETED || i.status === UploaderStatus.ERRORED)) {
          controller.status.set(UploaderStatus.COMPLETED);
        }
        return;
      }
      this.__simulateUpload(item, controller)
    } else {
      const storageRef = ref(this.storage, `${item.prefix ?? ''}${item.name ?? item.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file);
      item.status = UploaderStatus.UPLOADING;
      uploadTask.on('state_changed', {
        'next': (snapshot) => {
          item.progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          if (controller.items().every(i => i.status === UploaderStatus.COMPLETED || i.status === UploaderStatus.ERRORED)) {
            controller.status.set(UploaderStatus.COMPLETED);
          }
          controller.items.update(currentItems => [...currentItems]);
        },
        'error': (error) => {
          item.status = UploaderStatus.ERRORED;
          item.error = error.name;
        },
        'complete': () => {
          item.progress = 100;
          item.status = UploaderStatus.COMPLETED;
          if (controller.items().every(i => i.status === UploaderStatus.COMPLETED || i.status === UploaderStatus.ERRORED)) {
            controller.status.set(UploaderStatus.COMPLETED);
          }
          controller.items.update(currentItems => [...currentItems]);
        },
      });
    }
  }

  __simulateUpload(item: UploadItem, controller: UploaderController) {
    item.status = UploaderStatus.UPLOADING;
    const interval = setInterval(() => {
      if (item.progress < 100) {
        item.progress += Math.floor(Math.random() * 30); // Simulate progress
      } else {
        item.status = UploaderStatus.COMPLETED;
        clearInterval(interval);
        // Check if all items are completed
        if (controller.items().every(i => i.status === UploaderStatus.COMPLETED || i.status === UploaderStatus.ERRORED)) {
          controller.status.set(UploaderStatus.COMPLETED);
        }
      }
      controller.items.update(currentItems => [...currentItems]); // Trigger change detection
    }, 1000);
  }
}
