import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MiniUploaderService {
  expanded = signal(false);
  constructor() {
  }

  toggle() {
    this.expanded.update(current => !current);
  }

  close() {
    this.expanded.set(false);
  }

  open() {
    this.expanded.set(true);
  }

}
