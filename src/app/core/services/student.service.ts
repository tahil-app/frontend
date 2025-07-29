import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Observable } from 'rxjs';
import { UserAttachment } from '../models/user-attachment.model';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class StudentService extends ApiService<Student> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.STUDENTS.Controller);
  }

  activate(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.STUDENTS.Actions.Activate(id)), {});
  }

  deactivate(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.STUDENTS.Actions.Deactivate(id)), {});
  }

  uploadAttachment(attachment: UserAttachment): Observable<boolean> {
    const formData = new FormData();
    formData.append('DisplayName', attachment.displayName);
    formData.append('File', attachment.file, attachment.file.name);
    formData.append('UserId', attachment.userId.toString());

    return this.httpClient.post<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.STUDENTS.Actions.UploadAttachment), formData);
  }

  getViewAttachmentUrl(fileName: string): string {
    return this.appURLGenerator.getFullEndPoint(ApiEndpoints.ATTACHMENTS.Controller, ApiEndpoints.ATTACHMENTS.Actions.View(fileName));
  }

  getDownloadAttachment(fileName: string): string {
    return this.appURLGenerator.getFullEndPoint(ApiEndpoints.ATTACHMENTS.Controller, ApiEndpoints.ATTACHMENTS.Actions.Download(fileName));
  }

  deleteAttachment(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.STUDENTS.Actions.DeleteAttachment(id)));
  }

  uploadImage(file: File, userId: number): Observable<string> {
    const formData = new FormData();
    formData.append('File', file, file.name);
    formData.append('UserId', userId.toString());
    
    return this.httpClient.post<string>(this.appURLGenerator.getEndPoint(ApiEndpoints.STUDENTS.Actions.UploadImage), formData);
  }
}