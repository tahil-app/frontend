import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Group } from '../models/group.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class GroupService extends ApiService<Group> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.GROUPS.Controller);
  }

  updateStudents(groupId: number, studentIds: number[]): Observable<boolean> {
    return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.GROUPS.Actions.UpdateStudents(groupId)), studentIds);
  }
}