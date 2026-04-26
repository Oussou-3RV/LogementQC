import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface UploadResponse {
  urls: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = `${environment.apiLogiqueUrl}/uploads`;

  constructor(private http: HttpClient) {}

  uploadImages(files: File[]): Observable<UploadResponse> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.http.post<UploadResponse>(`${this.apiUrl}/images`, formData);
  }
}