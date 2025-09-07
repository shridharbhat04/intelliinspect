import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  private metadata: any = null;

  setMetadata(data: any) {
    this.metadata = data;
  }

  getMetadata() {
    return this.metadata;
  }
}