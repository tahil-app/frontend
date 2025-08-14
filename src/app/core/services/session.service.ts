import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ClassSession } from '../models/class-session.model';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends ApiService<ClassSession> {
  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.CLASS_SESSIONS.Controller);
  }

  getUserSessions(): Observable<ClassSession[]> {
    return this.httpClient.get<ClassSession[]>(this.appURLGenerator.getEndPoint(ApiEndpoints.CLASS_SESSIONS.Actions.User));
  }

  refreshSessions(): Observable<boolean> {
    return this.httpClient.post<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.CLASS_SESSIONS.Actions.Refresh), {});
  }
}