import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Observable } from 'rxjs';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class TeacherService extends ApiService<Teacher> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.TEACHERS.Controller);
  }

  activate(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.TEACHERS.Actions.Activate(id)), {});
  }

  deactivate(id: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.TEACHERS.Actions.Deactivate(id)), {});
  }

}