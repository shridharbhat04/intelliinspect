// src/app/services/upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  // Use your backend endpoint here
  private apiUrl = 'http://localhost:5000/api/upload/dataset';

  constructor(private http: HttpClient) {}

  /**
   * Upload a CSV file to the backend.
   * Returns an Observable of the metadata JSON returned by the backend.
   */
  uploadDataset(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post<any>(this.apiUrl, fd);
  }

  validateRanges(payload: any) {
  return this.http.post<any>('http://localhost:5000/api/ranges/validate', payload);
}

}